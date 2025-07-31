import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashData, hashTokenSHA256 } from 'src/common/utils/hash.util';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashData(createUserDto.password);

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData: UpdateUserDto = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await hashData(updateUserDto.password);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async updateRefreshTokenHash(userId: number, refreshToken?: string) {
    let refreshTokenHash = '';
    if (refreshToken) {
      refreshTokenHash = hashTokenSHA256(refreshToken);
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }
}
