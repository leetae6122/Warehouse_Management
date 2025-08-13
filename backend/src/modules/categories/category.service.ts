import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';
import { CrudService } from 'src/common/crud/crud.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CATEGORY_CACHE_KEY } from 'src/common/crud/cache.constant';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService extends CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager, prisma, CATEGORY_CACHE_KEY);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const args = {
      data: createCategoryDto,
      include: {
        products: true,
      },
    };
    return (await this.createData(args)) as CategoryDto;
  }

  async update(id: number, updateCategoryDto: CreateCategoryDto) {
    await this.findOne(id);
    const args = {
      where: { id },
      data: updateCategoryDto,
    };
    return (await this.updateData(args)) as CategoryDto;
  }

  async findAll() {
    return (await this.getManyData(
      {},
      {
        products: true,
      },
    )) as CategoryDto[];
  }

  async findOne(id: number) {
    const category = (await this.getDataByUnique(
      { id },
      {
        products: true,
      },
    )) as CategoryDto;
    if (!category) {
      throw new NotFoundException(MSG_NOT_FOUND('Category'));
    }
    return category;
  }
}
