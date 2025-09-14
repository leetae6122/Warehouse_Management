import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';
import { SaleItemDto } from './dto/sale-item.dto';
import { CrudService } from 'src/modules/crud/crud.service';
import { SALE_ITEM_CACHE_KEY } from 'src/modules/cache/cache.constant';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class SaleItemsService extends CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly cacheService: CacheService,
  ) {
    super(cacheService, prisma, SALE_ITEM_CACHE_KEY);
  }

  async create(createSaleItemDto: CreateSaleItemDto) {
    const args = {
      data: createSaleItemDto,
      include: {
        product: true,
        saleTransaction: true,
      },
    };
    return (await this.createData(args)) as SaleItemDto;
  }

  async findAll() {
    return (await this.getManyData(
      {},
      {
        product: true,
        saleTransaction: true,
      },
    )) as SaleItemDto[];
  }

  async findOne(id: number) {
    const item = (await this.getDataByUnique(
      { id },
      {
        product: true,
        saleTransaction: true,
      },
    )) as SaleItemDto;
    if (!item) throw new NotFoundException(MSG_NOT_FOUND('Sale Item'));
    return item;
  }

  async findByListId(ids: number[]): Promise<SaleItemDto[]> {
    return (await this.getManyData(
      {
        id: {
          in: ids,
        },
      },
      {
        product: true,
        saleTransaction: true,
      },
    )) as SaleItemDto[];
  }

  async findByTransactionId(transactionId: number): Promise<SaleItemDto[]> {
    return (await this.getManyData(
      { transactionId },
      {
        product: true,
        saleTransaction: true,
      },
    )) as SaleItemDto[];
  }

  async findByProductId(productId: number): Promise<SaleItemDto[]> {
    return (await this.getManyData(
      { productId },
      {
        product: true,
        saleTransaction: true,
      },
    )) as SaleItemDto[];
  }

  async update(id: number, updateSaleItemDto: UpdateSaleItemDto) {
    await this.findOne(id);
    const args = {
      where: { id },
      data: updateSaleItemDto,
    };
    return (await this.updateData(args)) as SaleItemDto;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.deleteData(id);
  }
}
