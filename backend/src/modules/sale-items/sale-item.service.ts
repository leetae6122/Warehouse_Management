import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';
import { SaleItemDto } from './dto/sale-item.dto';

@Injectable()
export class SaleItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleItemDto: CreateSaleItemDto) {
    return this.prisma.saleItem.create({
      data: createSaleItemDto,
    });
  }

  async findAll() {
    return this.prisma.saleItem.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.saleItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(MSG_NOT_FOUND('Sale Item'));
    return item;
  }

  async findByListId(ids: number[]): Promise<SaleItemDto[]> {
    return await this.prisma.saleItem.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        product: true,
        transaction: true,
      },
    });
  }

  async findByTransactionId(transactionId: number): Promise<SaleItemDto[]> {
    return await this.prisma.saleItem.findMany({
      where: { transactionId },
      include: {
        product: true,
        transaction: true,
      },
    });
  }

  async findByProductId(productId: number): Promise<SaleItemDto[]> {
    return await this.prisma.saleItem.findMany({
      where: { productId },
      include: {
        product: true,
        transaction: true,
      },
    });
  }

  async update(id: number, updateSaleItemDto: UpdateSaleItemDto) {
    await this.findOne(id);
    return this.prisma.saleItem.update({
      where: { id },
      data: updateSaleItemDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.saleItem.delete({ where: { id } });
  }
}
