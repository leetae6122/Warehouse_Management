import { PartialType } from '@nestjs/swagger';
import { CreateSaleTransactionDto } from './create-sale-transaction.dto';

export class UpdateSaleTransactionDto extends PartialType(
  CreateSaleTransactionDto,
) {}
