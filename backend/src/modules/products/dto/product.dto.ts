import { ApiProperty } from '@nestjs/swagger';
import { Product, Unit } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductDto implements Product {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Sản phẩm A' })
  name: string;

  @ApiProperty({ example: 'SKU12345' })
  sku: string;

  @ApiProperty({ example: 'Mô tả sản phẩm A', required: false })
  description: string;

  @ApiProperty({ example: '100.00', type: String })
  price: Decimal;

  @ApiProperty({ enum: Unit, example: Unit.PIECE })
  unit: Unit;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  imageUrl: string;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ type: [Number], example: [1, 2] })
  suppliers: number[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
