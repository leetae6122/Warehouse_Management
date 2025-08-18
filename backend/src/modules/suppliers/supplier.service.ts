import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';
import { CrudService } from 'src/common/crud/crud.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SUPPLIER_CACHE_KEY } from 'src/common/crud/cache.constant';
import { Cache } from 'cache-manager';
import { SupplierDto } from './dto/supplier.dto';

@Injectable()
export class SupplierService extends CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager, prisma, SUPPLIER_CACHE_KEY);
  }

  async create(createSupplierDto: CreateSupplierDto) {
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

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
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

  async findAll() {
    return (await this.getManyData(
      {},
      {
        products: true,
        goodsReceipts: true,
      },
    )) as SupplierDto[];
  }

  async findOne(id: number) {
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

  async findByListId(ids: number[]) {
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
