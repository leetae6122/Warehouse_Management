import { ApiProperty } from '@nestjs/swagger';
import { GoodsReceipt } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { ReceiptItemDto } from 'src/modules/receipt-items/dto/receipt-item.dto';
import { SupplierDto } from 'src/modules/suppliers/dto/supplier.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';

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

  @ApiProperty({ type: SupplierDto })
  @Type(() => SupplierDto)
  supplier?: SupplierDto;

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  user?: UserDto;

  @ApiProperty({ isArray: true, type: ReceiptItemDto })
  @Type(() => ReceiptItemDto)
  items?: ReceiptItemDto[];
}
