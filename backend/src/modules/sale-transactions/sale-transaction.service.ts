import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { SaleItemDto } from '../sale-items/dto/sale-item.dto';
import { SaleItemsService } from '../sale-items/sale-item.service';
import { UpdateSaleTransactionDto } from './dto/update-sale-transaction.dto';
import {
  MSG_NOT_FOUND,
  MSG_UPDATE_FORBIDDEN_TRANSACTION,
} from 'src/common/utils/message.util';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class SaleTransactionService {
  constructor(
    private prisma: PrismaService,
    private readonly saleItemsService: SaleItemsService,
  ) {}

  async create(
    userId: number,
    createSaleTransactionDto: CreateSaleTransactionDto,
  ) {
    // Calculate sale items and total amount from DTO
    const { saleItems, totalAmount } = await this.getSaleItemsAndTotalAmount(
      createSaleTransactionDto.items,
    );

    // For each sale item, check inventory and deduct stock
    for (const saleItem of saleItems) {
      // Get all receipt items (stock) for this product with remaining quantity > 0, ordered by expiryDate (FIFO)
      const availableItems = await this.prisma.receiptItem.findMany({
        where: {
          productId: saleItem.productId,
          remainingQuantity: {
            gt: 0,
          },
        },
        orderBy: {
          expiryDate: 'asc', // Use earliest expiry first
        },
      });

      let remainingToSell = saleItem.quantity;
      let totalAvailable = 0;

      // Calculate total available stock for this product
      for (const stockItem of availableItems) {
        totalAvailable += stockItem.remainingQuantity;
      }

      // If not enough stock, throw error before making any updates
      if (totalAvailable < remainingToSell) {
        throw new BadRequestException(
          `Insufficient stock for product ID ${saleItem.productId}`,
        );
      }

      // Deduct stock from receipt items in FIFO order
      for (const stockItem of availableItems) {
        if (remainingToSell <= 0) break;

        // Determine how much to deduct from this stock item
        const quantityToDeduct = Math.min(
          stockItem.remainingQuantity,
          remainingToSell,
        );

        // Update the receipt item with the new remaining quantity
        await this.prisma.receiptItem.update({
          where: { id: stockItem.id },
          data: {
            remainingQuantity: stockItem.remainingQuantity - quantityToDeduct,
          },
        });

        remainingToSell -= quantityToDeduct;
      }
    }

    // Create the sale transaction and associated sale items
    return await this.prisma.saleTransaction.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: saleItems,
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
    const saleTransaction = await this.prisma.saleTransaction.findUnique({
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
    if (!saleTransaction) {
      throw new BadRequestException(MSG_NOT_FOUND('Sale Transaction'));
    }
    return saleTransaction;
  }

  async update(
    id: number,
    user: UserDto,
    updateSaleTransactionDto: UpdateSaleTransactionDto,
  ) {
    const existingTransaction = await this.findOne(id);
    // If it is STAFF, only allow updates if the user is the one who created the sale transaction
    if (user.role === 'STAFF') {
      if (existingTransaction.userId !== user.id) {
        throw new ForbiddenException(MSG_UPDATE_FORBIDDEN_TRANSACTION);
      }
    }

    // If there is an update to the items, the old inventory quantity needs to be returned and the new quantity deducted.
    if (updateSaleTransactionDto.items) {
      // Return inventory from old transaction
      for (const transactionItem of existingTransaction.items) {
        // Only return inventory for the correct product and only for the quantity sold in this transaction
        await this.prisma.receiptItem.updateMany({
          where: {
            productId: transactionItem.productId,
            remainingQuantity: {
              gte: 0,
            },
          },
          data: {
            remainingQuantity: {
              increment: transactionItem.quantity,
            },
          },
        });
      }

      // Delete old sale items
      await this.prisma.saleItem.deleteMany({
        where: {
          transactionId: id,
        },
      });

      // Calculate new items and total money
      const { saleItems, totalAmount } = await this.getSaleItemsAndTotalAmount(
        updateSaleTransactionDto.items,
      );

      // Check inventory and update stock quantities for new items
      for (const saleItem of saleItems) {
        const availableItems = await this.prisma.receiptItem.findMany({
          where: {
            productId: saleItem.productId,
            remainingQuantity: {
              gt: 0,
            },
          },
          orderBy: {
            expiryDate: 'asc',
          },
        });

        let remainingToSell = saleItem.quantity;
        const totalAvailable = availableItems.reduce(
          (sum, item) => sum + item.remainingQuantity,
          0,
        );

        if (totalAvailable < remainingToSell) {
          throw new BadRequestException(
            `Insufficient stock for product ID ${saleItem.productId}`,
          );
        }

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
        }
      }
      // Update transaction with new items
      return await this.prisma.saleTransaction.update({
        where: { id },
        data: {
          totalAmount,
          items: {
            create: saleItems,
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

    // If only update userId
    if (updateSaleTransactionDto.userId && !updateSaleTransactionDto.items) {
      return await this.prisma.saleTransaction.update({
        where: { id },
        data: {
          userId: updateSaleTransactionDto.userId,
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
  }

  async getSaleItemsAndTotalAmount(
    items: number[],
  ): Promise<{ saleItems: SaleItemDto[]; totalAmount: number }> {
    const saleItems = await this.saleItemsService.findByListId(items);
    const totalAmount = saleItems.reduce(
      (sum, item) => sum + item.quantity * +item.priceAtSale,
      0,
    );
    return { saleItems, totalAmount };
  }
}
