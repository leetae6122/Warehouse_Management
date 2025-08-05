import { Module } from '@nestjs/common';
import { GoodsReceiptController } from './goods-receipt.controller';
import { GoodsReceiptService } from './goods-receipt.service';
import { ReceiptItemsModule } from '../receipt-items/receipt-item.module';

@Module({
  imports: [ReceiptItemsModule],
  controllers: [GoodsReceiptController],
  providers: [GoodsReceiptService],
  exports: [GoodsReceiptService],
})
export class GoodsReceiptModule {}
