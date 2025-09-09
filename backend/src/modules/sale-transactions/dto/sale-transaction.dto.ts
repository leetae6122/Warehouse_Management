import { ApiProperty } from '@nestjs/swagger';
import { SaleTransaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { SaleItemDto } from 'src/modules/sale-items/dto/sale-item.dto';

export class SaleTransactionDto implements SaleTransaction {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  totalAmount: Decimal;

  @ApiProperty()
  userId: number;

  @ApiProperty({ isArray: true, type: SaleItemDto })
  @Type(() => SaleItemDto)
  items?: SaleItemDto[];

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  user?: UserDto;
}
