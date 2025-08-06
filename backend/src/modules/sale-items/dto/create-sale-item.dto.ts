import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSaleItemDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 10 })
  quantity: number;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty({ example: '100.00', type: String })
  priceAtSale: Decimal;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  transactionId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  productId: number;
}
