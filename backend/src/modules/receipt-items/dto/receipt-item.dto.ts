import { ApiProperty } from '@nestjs/swagger';
import { ReceiptItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { GoodsReceiptDto } from 'src/modules/goods-receipts/dto/goods-receipt.dto';
import { ProductDto } from 'src/modules/products/dto/product.dto';

export class ReceiptItemDto implements ReceiptItem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  remainingQuantity: number;

  @ApiProperty()
  importPrice: Decimal;

  @ApiProperty()
  expiryDate: Date | null;

  @ApiProperty()
  goodsReceiptId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty({ type: GoodsReceiptDto })
  @Type(() => GoodsReceiptDto)
  goodsReceipt?: GoodsReceiptDto;

  @ApiProperty({ type: ProductDto })
  @Type(() => ProductDto)
  product?: ProductDto;
}
