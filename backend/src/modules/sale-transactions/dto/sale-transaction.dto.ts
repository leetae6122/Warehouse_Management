import { ApiProperty } from '@nestjs/swagger';
import { SaleItem, SaleTransaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class SaleTransactionDto implements SaleTransaction {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  totalAmount: Decimal;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  items: SaleItem[];
}
