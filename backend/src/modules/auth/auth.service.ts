import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  MSG_INVALID_TOKEN,
  MSG_LOGIN_SUCCESSFUL,
  MSG_LOGOUT_SUCCESSFUL,
  MSG_REFRESH_TOKEN_DOES_NOT_MATCH,
  MSG_REFRESH_TOKEN_SUCCESSFUL,
  MSG_USER_NOT_FOUND,
  MSG_WRONG_LOGIN_INFORMATION,
} from '../../common/utils/message.util';
import { compareHashedData } from '../../common/utils/hash.util';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
  createJWT,
  TokenType,
  verifyToken,
} from '../../common/utils/token.util';
import { UserService } from '../users/user.service';
import { UserDto } from '../users/dto/user.dto';
import { Request } from 'express';
import { IJwtPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(data: LoginAuthDto) {
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
      message: MSG_LOGIN_SUCCESSFUL,
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: foundUser,
    };
  }

  async logout(user: UserDto) {
    await this.userService.updateRefreshTokenHash(user.id);

    return { message: MSG_LOGOUT_SUCCESSFUL };
  }

  async refreshToken(req: Request) {
    const [type, refreshToken] = req.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException(MSG_INVALID_TOKEN);
    }

    const payload: IJwtPayload = verifyToken(refreshToken, TokenType.REFRESH);

    const foundUser = await this.userService.findOne(payload.id);
    if (!foundUser) {
      throw new BadRequestException(MSG_USER_NOT_FOUND);
    }

    const isMatch = await compareHashedData(
      refreshToken.slice(refreshToken.lastIndexOf('.')),
      foundUser.refreshTokenHash || '',
    );
    if (!isMatch) {
      throw new BadRequestException(MSG_REFRESH_TOKEN_DOES_NOT_MATCH);
    }
    const newAccessToken = createJWT(payload, TokenType.ACCESS);
    const newRefreshToken = createJWT(payload, TokenType.REFRESH);

    await this.userService.updateRefreshTokenHash(
      foundUser.id,
      newRefreshToken,
    );

    return {
      message: MSG_REFRESH_TOKEN_SUCCESSFUL,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
