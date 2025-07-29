import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { IJwtPayload } from '../interfaces/auth.interface';
import appConfig from 'src/config/app.config';

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

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
