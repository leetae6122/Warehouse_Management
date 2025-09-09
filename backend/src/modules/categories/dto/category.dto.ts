import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { Type } from 'class-transformer';
import { ProductDto } from 'src/modules/products/dto/product.dto';

export class CategoryDto implements Category {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ isArray: true, type: ProductDto })
  @Type(() => ProductDto)
  products?: ProductDto[];
}
