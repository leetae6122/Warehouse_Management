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

export class CreateProductDto {
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  name: string;

  @MaxLength(12)
  @IsNotEmpty()
  @IsString()
  sku: string;

  @MaxLength(100)
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDecimal()
  price: Decimal;

  @IsNotEmpty()
  @IsEnum(Unit)
  unit: Unit;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Sản phẩm phải có ít nhất 1 nhà cung cấp' })
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v, 10)) : [],
  )
  suppliers: number[];
}
