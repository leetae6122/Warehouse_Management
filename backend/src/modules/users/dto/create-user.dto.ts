import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';
export const normalizeStringDto = ({ value }: { value: string }) =>
  value.trim().replace(/ +/g, ' ');

export class CreateUserDto {
  @MaxLength(30)
  @IsString()
  @NotContains(' ', { message: 'Username should not contain spaces' })
  @Transform(normalizeStringDto)
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @MaxLength(20)
  @NotContains(' ', { message: 'Password should not contain spaces' })
  @IsStrongPassword(
    {
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 1,
      minLength: 5,
      minLowercase: 1,
    },
    {
      message:
        'Password must contain at least 1 number, 1 uppercase character and 1 special character',
    },
  )
  @MinLength(5)
  @IsString()
  @Transform(normalizeStringDto)
  @ApiProperty()
  password: string;

  @MaxLength(70)
  @IsString()
  @Transform(normalizeStringDto)
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty()
  role: Role = Role.STAFF;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isActive: boolean = true;
}
