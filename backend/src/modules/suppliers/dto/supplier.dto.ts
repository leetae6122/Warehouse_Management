import { Supplier } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GoodsReceiptDto } from 'src/modules/goods-receipts/dto/goods-receipt.dto';
import { ProductDto } from 'src/modules/products/dto/product.dto';

export class SupplierDto implements Supplier {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contactInfo: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ isArray: true, type: GoodsReceiptDto })
  @Type(() => GoodsReceiptDto)
  goodsReceipts?: GoodsReceiptDto[];

  @ApiProperty({ isArray: true, type: ProductDto })
  @Type(() => ProductDto)
  products?: ProductDto[];
}
