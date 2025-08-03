import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import {
  MSG_ERROR_LOGIN,
  MSG_ERROR_LOGOUT,
  MSG_ERROR_REFRESH_TOKEN,
  MSG_LOGIN_SUCCESSFUL,
  MSG_LOGOUT_SUCCESSFUL,
  MSG_REFRESH_TOKEN_SUCCESSFUL,
} from 'src/common/utils/message.util';
import { handleException } from 'src/common/utils/exception.util';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      return {
        statusCode: 200,
        message: MSG_LOGIN_SUCCESSFUL,
        data: await this.authService.login(loginAuthDto),
      };
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_LOGIN,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@User() user: UserDto) {
    try {
      return (await this.authService.logout(user))
        ? {
            statusCode: 200,
            message: MSG_LOGOUT_SUCCESSFUL,
          }
        : {
            statusCode: 400,
            message: 'Logout failed',
          };
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_LOGOUT,
      });
    }
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request) {
    try {
      return {
        statusCode: 200,
        message: MSG_REFRESH_TOKEN_SUCCESSFUL,
        data: await this.authService.refreshToken(req),
      };
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_REFRESH_TOKEN,
      });
    }
  }
}
