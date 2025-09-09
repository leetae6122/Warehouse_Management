import { ApiProperty } from '@nestjs/swagger';
import { Product, Unit } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { ReceiptItemDto } from 'src/modules/receipt-items/dto/receipt-item.dto';
import { SaleItemDto } from 'src/modules/sale-items/dto/sale-item.dto';
import { SupplierDto } from 'src/modules/suppliers/dto/supplier.dto';

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
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ isArray: true, type: SupplierDto })
  @Type(() => SupplierDto)
  suppliers?: SupplierDto[];

  @ApiProperty({ isArray: true, type: ReceiptItemDto })
  @Type(() => ReceiptItemDto)
  receiptItems?: ReceiptItemDto[];

  @ApiProperty({ isArray: true, type: SaleItemDto })
  @Type(() => SaleItemDto)
  saleItems?: SaleItemDto[];
}
