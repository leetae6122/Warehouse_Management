import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';
import { UpdateReceiptItemDto } from './dto/update-receipt-item.dto';
import { ReceiptItemDto } from './dto/receipt-item.dto';

@Injectable()
export class ReceiptItemsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReceiptItemDto: CreateReceiptItemDto,
  ): Promise<ReceiptItemDto> {
    return await this.prisma.receiptItem.create({
      data: createReceiptItemDto,
      include: {
        receipt: true,
        product: true,
      },
    });
  }

  async findAll(): Promise<ReceiptItemDto[]> {
    return await this.prisma.receiptItem.findMany({
      include: {
        receipt: true,
        product: true,
      },
    });
  }

  async findOne(id: number): Promise<ReceiptItemDto> {
    const receiptItem = await this.prisma.receiptItem.findUnique({
      where: { id },
      include: {
        receipt: true,
        product: true,
      },
    });

    if (!receiptItem) {
      throw new NotFoundException(`Receipt item with ID ${id} not found`);
    }

    return receiptItem;
  }

  async update(
    id: number,
    updateReceiptItemDto: UpdateReceiptItemDto,
  ): Promise<ReceiptItemDto> {
    // Check if receipt item exists
    await this.findOne(id);

    return await this.prisma.receiptItem.update({
      where: { id },
      data: updateReceiptItemDto,
      include: {
        receipt: true,
        product: true,
      },
    });
  }

  async remove(id: number): Promise<ReceiptItemDto> {
    // Check if receipt item exists
    await this.findOne(id);

    return await this.prisma.receiptItem.delete({
      where: { id },
      include: {
        receipt: true,
        product: true,
      },
    });
  }

  async findByReceiptId(receiptId: number): Promise<ReceiptItemDto[]> {
    return await this.prisma.receiptItem.findMany({
      where: { receiptId },
      include: {
        receipt: true,
        product: true,
      },
    });
  }

  async findByProductId(productId: number): Promise<ReceiptItemDto[]> {
    return await this.prisma.receiptItem.findMany({
      where: { productId },
      include: {
        receipt: true,
        product: true,
      },
    });
  }

  async findByListId(ids: number[]): Promise<ReceiptItemDto[]> {
    return await this.prisma.receiptItem.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        receipt: true,
        product: true,
      },
    });
  }
}
