import { ApiProperty } from '@nestjs/swagger';
import { Product, Unit } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductDto implements Product {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: Decimal;

  @ApiProperty()
  unit: Unit;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty()
  suppliers: number[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
