import { ApiProperty } from '@nestjs/swagger';
import { ReceiptItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ReceiptItemDto implements ReceiptItem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  remainingQuantity: number;

  @ApiProperty()
  importPrice: Decimal;

  @ApiProperty()
  expiryDate: Date | null;

  @ApiProperty()
  receiptId: number;

  @ApiProperty()
  productId: number;
}
