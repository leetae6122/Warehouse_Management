import { ApiProperty } from '@nestjs/swagger';
import { Category, Product } from '@prisma/client';

export class CategoryDto implements Category {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  products: Product[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
