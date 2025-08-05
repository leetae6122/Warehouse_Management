import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsDecimal,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Unit } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Sản phẩm A' })
  name: string;

  @MaxLength(12)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'SKU12345' })
  sku: string;

  @MaxLength(100)
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Mô tả sản phẩm A', required: false })
  description?: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty({ example: '100.00', type: String })
  price: Decimal;

  @IsNotEmpty()
  @IsEnum(Unit)
  @ApiProperty({ enum: Unit, example: Unit.PIECE })
  unit: Unit;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ example: 1 })
  categoryId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Product must have at least 1 supplier' })
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v, 10)) : [],
  )
  @ApiProperty({ type: [Number], example: [1, 2] })
  suppliers: number[];
}
