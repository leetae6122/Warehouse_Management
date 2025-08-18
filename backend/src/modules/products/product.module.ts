import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileModule } from '../files/file.module';
import { ReceiptItemsModule } from '../receipt-items/receipt-item.module';
import { SupplierModule } from '../suppliers/supplier.module';

@Module({
  imports: [FileModule, ReceiptItemsModule, SupplierModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
