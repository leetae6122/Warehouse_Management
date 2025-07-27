import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';

@Injectable()
export class SaleTransactionService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createSaleTransactionDto: CreateSaleTransactionDto,
  ) {
    const { items } = createSaleTransactionDto;

    // Tính tổng tiền từ các items
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.priceAtSale,
      0,
    );

    // Kiểm tra tồn kho và cập nhật số lượng tồn
    for (const item of items) {
      const availableItems = await this.prisma.receiptItem.findMany({
        where: {
          productId: item.productId,
          remainingQuantity: {
            gt: 0,
          },
        },
        orderBy: {
          expiryDate: 'asc', // Ưu tiên những sản phẩm gần hết hạn
        },
      });

      let remainingToSell = item.quantity;
      let hasEnoughStock = false;

      for (const stockItem of availableItems) {
        if (remainingToSell <= 0) break;

        const quantityToDeduct = Math.min(
          stockItem.remainingQuantity,
          remainingToSell,
        );
        await this.prisma.receiptItem.update({
          where: { id: stockItem.id },
          data: {
            remainingQuantity: stockItem.remainingQuantity - quantityToDeduct,
          },
        });

        remainingToSell -= quantityToDeduct;
        if (remainingToSell === 0) {
          hasEnoughStock = true;
          break;
        }
      }

      if (!hasEnoughStock) {
        throw new BadRequestException(
          `Không đủ số lượng tồn kho cho sản phẩm ID ${item.productId}`,
        );
      }
    }

    // Tạo giao dịch bán hàng
    return await this.prisma.saleTransaction.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
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
    return await this.prisma.saleTransaction.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
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
    return await this.prisma.saleTransaction.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
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
