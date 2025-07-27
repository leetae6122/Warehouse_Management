import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';

@Injectable()
export class GoodsReceiptService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createGoodsReceiptDto: CreateGoodsReceiptDto) {
    const { supplierId, items } = createGoodsReceiptDto;

    // Tính tổng tiền từ các items
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.importPrice,
      0,
    );

    return await this.prisma.goodsReceipt.create({
      data: {
        supplierId,
        userId,
        totalAmount,
        items: {
          create: items.map((item) => ({
            ...item,
            remainingQuantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.goodsReceipt.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.goodsReceipt.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });
  }
}
