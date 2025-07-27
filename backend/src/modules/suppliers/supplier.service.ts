import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    return await this.prisma.supplier.create({
      data: createSupplierDto,
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
