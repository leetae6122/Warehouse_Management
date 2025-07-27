import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GoodsReceiptService } from './goods-receipt.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';

@Controller('goods-receipts')
export class GoodsReceiptController {
  constructor(private readonly goodsReceiptService: GoodsReceiptService) {}

  @Post()
  create(@Request() req, @Body() createGoodsReceiptDto: CreateGoodsReceiptDto) {
    return this.goodsReceiptService.create(req.user.id, createGoodsReceiptDto);
  }

  @Get()
  findAll() {
    return this.goodsReceiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsReceiptService.findOne(+id);
  }
}
