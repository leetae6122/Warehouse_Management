import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinDate,
} from 'class-validator';

export class CreateReceiptItemDto {
  @MaxLength(100)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 10, required: true })
  quantity: number;

  @MaxLength(100)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 10, required: true })
  remainingQuantity: number;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty({ example: 1000.0, required: true })
  importPrice: Decimal;

  @MinDate(new Date())
  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  expiryDate?: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  receiptId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  productId: number;
}
