import { Module } from '@nestjs/common';
import { SaleItemsController } from './sale-item.controller';
import { SaleItemsService } from './sale-item.service';

@Module({
  controllers: [SaleItemsController],
  providers: [SaleItemsService],
  exports: [SaleItemsService],
})
export class SaleItemsModule {}
