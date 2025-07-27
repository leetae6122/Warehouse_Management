import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { TransformDtoInterceptor } from '../../common/interceptors/transform-dto.interceptor';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(new TransformDtoInterceptor(UserDto))
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@User() user: UserDto) {
    return this.authService.logout(user);
  }

  @Post('refresh')
  async refreshTokens(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }
}
