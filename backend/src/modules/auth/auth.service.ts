import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  MSG_INVALID_TOKEN,
  MSG_NOT_FOUND,
  MSG_REFRESH_TOKEN_NOT_AVAILABLE,
  MSG_WRONG_LOGIN_INFORMATION,
} from '../../common/utils/message.util';
import {
  compareHashedData,
  isJwtMatchHashed,
} from '../../common/utils/hash.util';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
  createJWT,
  TokenType,
  verifyToken,
} from '../../common/utils/token.util';
import { UserService } from '../users/user.service';
import { UserDto } from '../users/dto/user.dto';
import { Request } from 'express';
import {
  IJwtPayload,
  ILoginResponse,
  IVerifyJwtPayload,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(data: LoginAuthDto): Promise<ILoginResponse> {
    const { username, password, isRemember } = data;
    const foundUser = await this.userService.findByUsername(username);
    if (!foundUser) {
      throw new BadRequestException(MSG_WRONG_LOGIN_INFORMATION);
    }

    const isMatch = await compareHashedData(password, foundUser.password);
    if (!isMatch) {
      throw new BadRequestException(MSG_WRONG_LOGIN_INFORMATION);
    }

    const payload: IJwtPayload = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    };

    const accessToken = createJWT(payload, TokenType.ACCESS);
    let refreshToken: string = '';
    if (isRemember) {
      refreshToken = createJWT(payload, TokenType.REFRESH);
      await this.userService.updateRefreshTokenHash(foundUser.id, refreshToken);
    }

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        fullName: foundUser.fullName,
        role: foundUser.role,
      },
    };
  }

  async logout(user: UserDto) {
    return (await this.userService.updateRefreshTokenHash(user.id))
      ? true
      : false;
  }

  async refreshToken(req: Request) {
    const [type, refreshToken] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException(MSG_INVALID_TOKEN);
    }

    const verifyPayload: IVerifyJwtPayload = verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );

    const foundUser = await this.userService.findOne(verifyPayload.id);
    if (!foundUser) {
      throw new BadRequestException(MSG_NOT_FOUND('User'));
    }
    const isMatch = isJwtMatchHashed(
      refreshToken,
      foundUser.refreshTokenHash || '',
    );
    if (!isMatch) {
      throw new BadRequestException(MSG_REFRESH_TOKEN_NOT_AVAILABLE);
    }

    const payload: IJwtPayload = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    };
    const newAccessToken = createJWT(payload, TokenType.ACCESS);
    const newRefreshToken = createJWT(payload, TokenType.REFRESH);
    await this.userService.updateRefreshTokenHash(
      foundUser.id,
      newRefreshToken,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
