import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { SaleTransactionService } from './sale-transaction.service';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';

@Controller('sale-transactions')
export class SaleTransactionController {
  constructor(
    private readonly saleTransactionService: SaleTransactionService,
  ) {}

  @Post()
  create(
    @Request() req,
    @Body() createSaleTransactionDto: CreateSaleTransactionDto,
  ) {
    return this.saleTransactionService.create(
      req.user.id,
      createSaleTransactionDto,
    );
  }

  @Get()
  findAll() {
    return this.saleTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleTransactionService.findOne(+id);
  }
}
