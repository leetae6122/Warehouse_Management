import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  MSG_PASSWORD_EMPTY,
  MSG_USERNAME_EMPTY,
} from 'src/common/utils/message.util';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty({ message: MSG_USERNAME_EMPTY })
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty({ message: MSG_PASSWORD_EMPTY })
  @ApiProperty()
  password: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  isRemember?: boolean = false;
}
