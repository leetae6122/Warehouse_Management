import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: number, updateCategoryDto: CreateCategoryDto) {
    const foundCategory = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!foundCategory) {
      throw new NotFoundException(MSG_NOT_FOUND('Category'));
    }

    return await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }
}
