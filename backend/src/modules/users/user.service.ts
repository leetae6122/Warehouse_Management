import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashData, hashTokenSHA256 } from 'src/common/utils/hash.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CrudService } from 'src/common/crud/crud.service';
import { USER_CACHE_KEY } from 'src/common/crud/cache.constant';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService extends CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager, prisma, USER_CACHE_KEY);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await hashData(createUserDto.password);

    const args = {
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    };
    return (await this.createData(args)) as UserDto;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData: UpdateUserDto = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await hashData(updateUserDto.password);
    }
    const args = {
      where: {
        id,
      },
      data: updateData,
    };
    return (await this.updateData(args)) as UserDto;
  }

  async updateRefreshTokenHash(userId: number, refreshToken?: string) {
    let refreshTokenHash: string | null = null;
    if (refreshToken) {
      refreshTokenHash = hashTokenSHA256(refreshToken);
    }

    const args = {
      where: { id: userId },
      data: { refreshTokenHash },
    };
    return (await this.updateData(args)) as UserDto;
  }

  async findAll() {
    return (await this.getManyData({}, {})) as UserDto;
  }

  async findOne(id: number) {
    return (await this.getDataByUnique({ id })) as UserDto;
  }

  async findByUsername(username: string) {
    return (await this.getDataByUnique({ username })) as UserDto;
  }
}
