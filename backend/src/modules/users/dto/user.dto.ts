import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { GoodsReceiptDto } from 'src/modules/goods-receipts/dto/goods-receipt.dto';
import { SaleTransactionDto } from 'src/modules/sale-transactions/dto/sale-transaction.dto';

export class UserDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @Exclude()
  password: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  isActive: boolean;

  @Exclude()
  refreshTokenHash: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ isArray: true, type: GoodsReceiptDto })
  @Type(() => GoodsReceiptDto)
  goodsReceipts?: GoodsReceiptDto[];

  @ApiProperty({ isArray: true, type: SaleTransactionDto })
  @Type(() => SaleTransactionDto)
  saleTransactions?: SaleTransactionDto[];
}
