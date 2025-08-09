import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { IJwtPayload } from '../interfaces/auth.interface';
import appConfig from 'src/config/app.config';
import { MSG_ERROR_ACCOUNT_DEACTIVATED } from 'src/common/utils/message.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig().jwt.secret,
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user does not exist');
    }
    if (!user.isActive) {
      throw new BadRequestException(MSG_ERROR_ACCOUNT_DEACTIVATED);
    }

    return user;
  }
}
