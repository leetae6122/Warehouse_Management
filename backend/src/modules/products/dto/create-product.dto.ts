import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Unit } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsEnum(Unit)
  unit: Unit;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber()
  categoryId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Sản phẩm phải có ít nhất 1 nhà cung cấp' })
  @IsNumber({}, { each: true })
  supplierIds: number[];
}
