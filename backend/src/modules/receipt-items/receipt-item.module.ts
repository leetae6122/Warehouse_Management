import { Module } from '@nestjs/common';
import { ReceiptItemsController } from './receipt-item.controller';
import { ReceiptItemsService } from './receipt-item.service';

@Module({
  controllers: [ReceiptItemsController],
  providers: [ReceiptItemsService],
  exports: [ReceiptItemsService],
})
export class ReceiptItemsModule {}
