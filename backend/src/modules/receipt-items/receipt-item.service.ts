import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';
import { UpdateReceiptItemDto } from './dto/update-receipt-item.dto';
import { ReceiptItemDto } from './dto/receipt-item.dto';
import { CrudService } from 'src/modules/crud/crud.service';
import { RECEIPT_ITEM_CACHE_KEY } from 'src/modules/cache/cache.constant';
import { FilterCrudDto } from 'src/modules/crud/filter/filter-crud.dto';
import { ResponseFilter } from 'src/modules/crud/filter/filter.interface';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ReceiptItemService extends CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly cacheService: CacheService,
  ) {
    super(cacheService, prisma, RECEIPT_ITEM_CACHE_KEY);
  }

  async create(
    createReceiptItemDto: CreateReceiptItemDto,
  ): Promise<ReceiptItemDto> {
    const args = {
      data: createReceiptItemDto,
      include: {
        goodsReceipt: true,
        product: true,
      },
    };
    return (await this.createData(args)) as ReceiptItemDto;
  }

  async findAll(): Promise<ReceiptItemDto[]> {
    return (await this.getManyData(
      {},
      {
        goodsReceipt: true,
        product: true,
      },
    )) as ReceiptItemDto[];
  }

  async findOne(id: number): Promise<ReceiptItemDto> {
    const receiptItem = (await this.getDataByUnique(
      { id },
      {
        goodsReceipt: true,
        product: true,
      },
    )) as ReceiptItemDto;

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
    const args = {
      where: { id },
      data: updateReceiptItemDto,
      include: {
        goodsReceipt: true,
        product: true,
      },
    };
    return (await this.updateData(args)) as ReceiptItemDto;
  }

  async remove(id: number): Promise<void> {
    // Check if receipt item exists
    await this.findOne(id);

    return await this.deleteData(id);
  }

  async findByReceiptId(receiptId: number): Promise<ReceiptItemDto[]> {
    return (await this.getManyData(
      { receiptId },
      {
        goodsReceipt: true,
        product: true,
      },
    )) as ReceiptItemDto[];
  }

  async findByProductId(productId: number): Promise<ReceiptItemDto[]> {
    return (await this.getManyData(
      { productId },
      {
        goodsReceipt: true,
        product: true,
      },
    )) as ReceiptItemDto[];
  }

  async findByListId(ids: number[]): Promise<ReceiptItemDto[]> {
    return (await this.getManyData(
      {
        id: {
          in: ids,
        },
      },
      {
        goodsReceipt: true,
        product: true,
      },
    )) as ReceiptItemDto[];
  }

  async getList(
    filterDto: FilterCrudDto,
  ): Promise<ResponseFilter<ReceiptItemDto>> {
    return this.getList(filterDto);
  }

  async deleteManyByGoodsReceiptId(id: number): Promise<void> {
    const where = { receiptId: id };
    await this.deleteManyData(where);
  }

  async getStock(productId: number) {
    const receiptItems = await this.prisma.receiptItem.findMany({
      where: {
        productId,
        remainingQuantity: {
          gt: 0,
        },
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });

    const totalStock = receiptItems.reduce(
      (sum, item) => sum + item.remainingQuantity,
      0,
    );

    return {
      totalStock,
      items: receiptItems,
    };
  }
}
