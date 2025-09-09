import { ApiProperty } from '@nestjs/swagger';
import { SaleItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { ProductDto } from 'src/modules/products/dto/product.dto';
import { SaleTransactionDto } from 'src/modules/sale-transactions/dto/sale-transaction.dto';

export class SaleItemDto implements SaleItem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  priceAtSale: Decimal;

  @ApiProperty()
  saleTransactionId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty({ type: SaleTransactionDto })
  @Type(() => SaleTransactionDto)
  saleTransaction?: SaleTransactionDto;

  @ApiProperty({ type: ProductDto })
  @Type(() => ProductDto)
  product?: ProductDto;
}
