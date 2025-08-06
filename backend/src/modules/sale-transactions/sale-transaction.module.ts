import { Module } from '@nestjs/common';
import { SaleTransactionController } from './sale-transaction.controller';
import { SaleTransactionService } from './sale-transaction.service';
import { SaleItemsModule } from '../sale-items/sale-item.module';

@Module({
  imports: [SaleItemsModule],
  controllers: [SaleTransactionController],
  providers: [SaleTransactionService],
  exports: [SaleTransactionService],
})
export class SaleTransactionModule {}
