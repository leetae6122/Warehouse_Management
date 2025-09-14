import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';
import { ReceiptItemService } from '../receipt-items/receipt-item.service';
import {
  MSG_NOT_FOUND,
  MSG_UPDATE_FORBIDDEN_RECEIPT,
} from 'src/common/utils/message.util';
import { ReceiptItemDto } from '../receipt-items/dto/receipt-item.dto';
import { isArray } from 'class-validator';
import { UserDto } from '../users/dto/user.dto';
import { GOODS_RECEIPT_CACHE_KEY } from 'src/modules/cache/cache.constant';
import { CrudService } from 'src/modules/crud/crud.service';
import { GoodsReceiptDto } from './dto/goods-receipt.dto';
import { CacheService } from '../cache/cache.service';

interface UpdateGoodsReceiptData {
  totalAmount: number;
  items: [];
  supplierId: number;
}

@Injectable()
export class GoodsReceiptService extends CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly receiptItemService: ReceiptItemService,
    protected readonly cacheService: CacheService,
  ) {
    super(cacheService, prisma, GOODS_RECEIPT_CACHE_KEY);
  }

  async create(userId: number, createGoodsReceiptDto: CreateGoodsReceiptDto) {
    const { supplierId, items } = createGoodsReceiptDto;

    const { receiptItems, totalAmount } =
      await this.getReceiptItemsAndTotalAmount(items);

    const args = {
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
    };
    return (await this.createData(args)) as GoodsReceiptDto;
  }

  async findAll() {
    return (await this.getManyData(
      {},
      {
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
    )) as GoodsReceiptDto[];
  }

  async findOne(id: number) {
    const goodsReceipt = (await this.getDataByUnique(
      { id },
      {
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
    )) as GoodsReceiptDto;
    if (!goodsReceipt) {
      throw new NotFoundException(MSG_NOT_FOUND('Goods Receipt'));
    }
    return goodsReceipt;
  }

  async update(
    id: number,
    user: UserDto,
    updateGoodsReceiptDto: UpdateGoodsReceiptDto,
  ) {
    const existingReceipt = await this.findOne(id);
    // If it is STAFF, only allow updates if the user is the one who created the sale transaction
    if (user.role === 'STAFF') {
      if (existingReceipt.userId !== user.id) {
        throw new ForbiddenException(MSG_UPDATE_FORBIDDEN_RECEIPT);
      }
    }

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
      await this.receiptItemService.deleteManyByGoodsReceiptId(id);

      // Get new receipt items
      const { receiptItems, totalAmount } =
        await this.getReceiptItemsAndTotalAmount(items);

      // Update total amount
      updateData.totalAmount = totalAmount;

      // Create new items
      await Promise.all(
        receiptItems.map((item) =>
          this.receiptItemService.create({
            ...item,
            receiptId: id,
            expiryDate: item.expiryDate === null ? undefined : item.expiryDate,
          }),
        ),
      );
    }

    // Update the goods receipt
    return (await this.updateData({
      where: { id },
      data: {
        ...(updateData.supplierId !== undefined && {
          supplierId: updateData.supplierId,
        }),
        ...(updateData.totalAmount !== undefined && {
          totalAmount: updateData.totalAmount,
        }),
      },
    })) as GoodsReceiptDto;
  }

  async getReceiptItemsAndTotalAmount(
    items: number[],
  ): Promise<{ receiptItems: ReceiptItemDto[]; totalAmount: number }> {
    const receiptItems = await this.receiptItemService.findByListId(items);
    const totalAmount = receiptItems.reduce(
      (sum, item) => sum + item.quantity * +item.importPrice,
      0,
    );
    return { receiptItems, totalAmount };
  }
}
