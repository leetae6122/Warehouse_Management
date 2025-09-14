import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';
import { CrudService } from 'src/modules/crud/crud.service';
import { SUPPLIER_CACHE_KEY } from 'src/modules/cache/cache.constant';
import { SupplierDto } from './dto/supplier.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class SupplierService extends CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly cacheService: CacheService,
  ) {
    super(cacheService, prisma, SUPPLIER_CACHE_KEY);
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<SupplierDto> {
    const args = {
      data: createSupplierDto,
      include: {
        products: true,
        goodsReceipts: {
          include: {
            items: true,
          },
        },
      },
    };
    return (await this.createData(args)) as SupplierDto;
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<SupplierDto> {
    await this.findOne(id);
    const args = {
      where: { id },
      data: updateSupplierDto,
      include: {
        products: true,
        goodsReceipts: {
          include: {
            items: true,
          },
        },
      },
    };
    return (await this.updateData(args)) as SupplierDto;
  }

  async findAll(): Promise<SupplierDto[]> {
    return (await this.getManyData(
      {},
      {
        products: true,
        goodsReceipts: true,
      },
    )) as SupplierDto[];
  }

  async findOne(id: number): Promise<SupplierDto> {
    const supplier = (await this.getDataByUnique(
      { id },
      {
        products: true,
        goodsReceipts: {
          include: {
            items: true,
          },
        },
      },
    )) as SupplierDto;
    if (!supplier) {
      throw new NotFoundException(MSG_NOT_FOUND('Supplier'));
    }
    return supplier;
  }

  async findByListId(ids: number[]): Promise<SupplierDto[]> {
    return (await this.getManyData(
      {
        id: {
          in: ids,
        },
      },
      {
        products: true,
        goodsReceipts: {
          include: {
            items: true,
          },
        },
      },
    )) as SupplierDto[];
  }
}
