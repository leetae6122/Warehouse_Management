import { ApiProperty } from '@nestjs/swagger';
import { SaleItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class SaleItemDto implements SaleItem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  priceAtSale: Decimal;

  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  productId: number;
}
