import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  MSG_NOT_FOUND,
  MSG_PRODUCT_EXISTS,
} from 'src/common/utils/message.util';
import { FileService } from '../files/file.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { suppliers, ...productData } = createProductDto;
    const productExist = await this.prisma.product.findUnique({
      where: { sku: productData.sku },
    });
    if (productExist) {
      throw new BadRequestException(MSG_PRODUCT_EXISTS);
    }
    await this.checkSuppliersExist(suppliers);

    return this.prisma.product.create({
      data: {
        ...productData,
        suppliers: {
          connect: suppliers.map((id) => ({ id })),
        },
      },
      include: {
        category: true,
        suppliers: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { suppliers, ...productData } = updateProductDto;

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(MSG_NOT_FOUND('Product'));
    }

    if (suppliers) {
      await this.checkSuppliersExist(suppliers);
    }

    if (product.imageUrl && productData.imageUrl !== '') {
      this.fileService.deleteFile(product.imageUrl);
    }

    return await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        suppliers: suppliers
          ? {
              set: suppliers.map((id) => ({ id })),
            }
          : undefined,
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

  async checkSuppliersExist(suppliers: number[]) {
    const suppliersExist = await this.prisma.supplier.findMany({
      where: {
        id: {
          in: suppliers,
        },
      },
    });

    if (suppliersExist.length !== suppliers.length) {
      throw new NotFoundException('One or more suppliers do not exist');
    }
  }
}
