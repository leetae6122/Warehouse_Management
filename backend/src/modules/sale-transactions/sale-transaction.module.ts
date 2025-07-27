import { Module } from '@nestjs/common';
import { SaleTransactionController } from './sale-transaction.controller';
import { SaleTransactionService } from './sale-transaction.service';

@Module({
  controllers: [SaleTransactionController],
  providers: [SaleTransactionService],
  exports: [SaleTransactionService],
})
export class SaleTransactionModule {}
