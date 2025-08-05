import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { CategoryModule } from './modules/categories/category.module';
import { SupplierModule } from './modules/suppliers/supplier.module';
import { ProductModule } from './modules/products/product.module';
import { GoodsReceiptModule } from './modules/goods-receipts/goods-receipt.module';
import { SaleTransactionModule } from './modules/sale-transactions/sale-transaction.module';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/files/file.module';
import { ExceptionInterceptor } from './common/interceptors/exception.interceptor';
import { ReceiptItemsModule } from './modules/receipt-items/receipt-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    SupplierModule,
    ProductModule,
    GoodsReceiptModule,
    SaleTransactionModule,
    FileModule,
    ReceiptItemsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
  ],
})
export class AppModule {}
