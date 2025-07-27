import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { supplierIds, ...productData } = createProductDto;

    // Kiểm tra suppliers có tồn tại
    const suppliers = await this.prisma.supplier.findMany({
      where: {
        id: {
          in: supplierIds,
        },
      },
    });

    if (suppliers.length !== supplierIds.length) {
      throw new NotFoundException('Một hoặc nhiều nhà cung cấp không tồn tại');
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        suppliers: {
          connect: supplierIds.map((id) => ({ id })),
        },
      },
      include: {
        category: true,
        suppliers: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      include: {
        category: true,
        suppliers: true,
        receiptItems: {
          select: {
            remainingQuantity: true,
            expiryDate: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        suppliers: true,
        receiptItems: {
          select: {
            remainingQuantity: true,
            expiryDate: true,
          },
        },
      },
    });
  }

  async getStock(id: number) {
    const receiptItems = await this.prisma.receiptItem.findMany({
      where: {
        productId: id,
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
