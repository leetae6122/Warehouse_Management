import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    return await this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const foundSupplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!foundSupplier) {
      throw new NotFoundException(MSG_NOT_FOUND('Supplier'));
    }
    return await this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async findAll() {
    return await this.prisma.supplier.findMany({
      include: {
        products: true,
        goodsReceipts: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
        goodsReceipts: {
          include: {
            items: true,
          },
        },
      },
    });
  }
}
