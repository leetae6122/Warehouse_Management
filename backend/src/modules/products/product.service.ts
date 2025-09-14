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
import { CrudService } from 'src/modules/crud/crud.service';
import { PRODUCT_CACHE_KEY } from 'src/modules/cache/cache.constant';
import { ProductDto } from './dto/product.dto';
import { SupplierService } from '../suppliers/supplier.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProductService extends CrudService {
  constructor(
    private fileService: FileService,
    private supplierService: SupplierService,
    protected readonly prisma: PrismaService,
    protected readonly cacheService: CacheService,
  ) {
    super(cacheService, prisma, PRODUCT_CACHE_KEY);
  }

  async create(createProductDto: CreateProductDto) {
    const { suppliers, ...productData } = createProductDto;
    const productExist = (await this.getDataByUnique({
      sku: productData.sku,
    })) as ProductDto;
    if (productExist) {
      throw new BadRequestException(MSG_PRODUCT_EXISTS);
    }
    await this.checkSuppliersExist(suppliers);

    const args = {
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
    };
    return (await this.createData(args)) as ProductDto;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { suppliers, ...productData } = updateProductDto;

    const product = await this.findOne(id);

    if (suppliers) {
      await this.checkSuppliersExist(suppliers);
    }

    if (product.imageUrl && productData.imageUrl !== '') {
      this.fileService.deleteFile(product.imageUrl);
    }

    const args = {
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
    };
    return (await this.updateData(args)) as ProductDto;
  }

  async findAll() {
    return (await this.getManyData(
      {},
      {
        category: true,
        suppliers: true,
        receiptItems: {
          select: {
            remainingQuantity: true,
            expiryDate: true,
          },
        },
      },
    )) as ProductDto[];
  }

  async findOne(id: number) {
    const product = (await this.getDataByUnique(
      { id },
      {
        category: true,
        suppliers: true,
        receiptItems: {
          select: {
            remainingQuantity: true,
            expiryDate: true,
          },
        },
      },
    )) as ProductDto;
    if (!product) {
      throw new NotFoundException(MSG_NOT_FOUND('Product'));
    }
    return product;
  }

  async checkSuppliersExist(supplierIds: number[]) {
    const suppliersExist = await this.supplierService.findByListId(supplierIds);

    if (suppliersExist.length !== supplierIds.length) {
      throw new NotFoundException('One or more suppliers do not exist');
    }
  }
}
