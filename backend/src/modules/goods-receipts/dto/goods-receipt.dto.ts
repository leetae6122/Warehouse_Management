import { ApiProperty } from '@nestjs/swagger';
import { GoodsReceipt, ReceiptItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class GoodsReceiptDto implements GoodsReceipt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  totalAmount: Decimal;

  @ApiProperty()
  supplierId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  items: ReceiptItem[];
}
