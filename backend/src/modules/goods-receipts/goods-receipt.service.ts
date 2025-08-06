import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';
import { ReceiptItemsService } from '../receipt-items/receipt-item.service';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';
import { ReceiptItemDto } from '../receipt-items/dto/receipt-item.dto';
import { isArray } from 'class-validator';

interface UpdateGoodsReceiptData {
  totalAmount: number;
  items: [];
  supplierId: number;
}

@Injectable()
export class GoodsReceiptService {
  constructor(
    private prisma: PrismaService,
    private readonly receiptItemsService: ReceiptItemsService,
  ) {}

  async create(userId: number, createGoodsReceiptDto: CreateGoodsReceiptDto) {
    const { supplierId, items } = createGoodsReceiptDto;

    const { receiptItems, totalAmount } =
      await this.getReceiptItemsAndTotalAmount(items);

    return await this.prisma.goodsReceipt.create({
      data: {
        supplierId,
        userId,
        totalAmount,
        items: {
          create: receiptItems.map((item) => ({
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
    const goodsReceipt = await this.prisma.goodsReceipt.findUnique({
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
    if (!goodsReceipt) {
      throw new NotFoundException(MSG_NOT_FOUND('Goods Receipt'));
    }
    return goodsReceipt;
  }

  async update(id: number, updateGoodsReceiptDto: UpdateGoodsReceiptDto) {
    await this.findOne(id);

    const { supplierId, items } = updateGoodsReceiptDto;
    const updateData: UpdateGoodsReceiptData = {
      items: [],
      supplierId: 0,
      totalAmount: 0,
    };

    // Update supplier if provided
    if (supplierId !== undefined) {
      updateData.supplierId = supplierId;
    }

    // Update items if provided
    if (isArray(items) && items.length > 0) {
      // Delete existing items
      await this.prisma.receiptItem.deleteMany({
        where: { receiptId: id },
      });

      // Get new receipt items
      const { receiptItems, totalAmount } =
        await this.getReceiptItemsAndTotalAmount(items);

      // Update total amount
      updateData.totalAmount = totalAmount;

      // Create new items
      await this.prisma.receiptItem.createMany({
        data: receiptItems.map((item) => ({
          receiptId: id,
          productId: item.productId,
          quantity: item.quantity,
          importPrice: item.importPrice,
          remainingQuantity: item.quantity,
        })),
      });
    }

    // Update the goods receipt
    return await this.prisma.goodsReceipt.update({
      where: { id },
      data: {
        ...(updateData.supplierId !== undefined && {
          supplierId: updateData.supplierId,
        }),
        ...(updateData.totalAmount !== undefined && {
          totalAmount: updateData.totalAmount,
        }),
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

  async getReceiptItemsAndTotalAmount(
    items: number[],
  ): Promise<{ receiptItems: ReceiptItemDto[]; totalAmount: number }> {
    const receiptItems = await this.receiptItemsService.findByListId(items);
    const totalAmount = receiptItems.reduce(
      (sum, item) => sum + item.quantity * +item.importPrice,
      0,
    );
    return { receiptItems, totalAmount };
  }
}
