import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @Exclude()
  password: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  isActive: boolean;

  @Exclude()
  refreshTokenHash: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
