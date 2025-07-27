import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashData } from 'src/common/utils/hash.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { MSG_USER_NOT_FOUND } from 'src/common/utils/message.util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashData(createUserDto.password);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(MSG_USER_NOT_FOUND);
    }

    const updateData: UpdateUserDto = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await hashData(updateUserDto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async updateRefreshTokenHash(userId: number, refreshToken?: string) {
    let refreshTokenHash = '';
    if (refreshToken) {
      refreshTokenHash = await hashData(refreshToken);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
