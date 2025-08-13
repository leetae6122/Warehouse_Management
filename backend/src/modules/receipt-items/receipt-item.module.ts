import { Module } from '@nestjs/common';
import { ReceiptItemController } from './receipt-item.controller';
import { ReceiptItemService } from './receipt-item.service';

@Module({
  controllers: [ReceiptItemController],
  providers: [ReceiptItemService],
  exports: [ReceiptItemService],
})
export class ReceiptItemsModule {}
