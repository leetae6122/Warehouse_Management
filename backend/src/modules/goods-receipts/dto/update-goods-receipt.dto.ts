import { PartialType } from '@nestjs/swagger';
import { CreateGoodsReceiptDto } from './create-goods-receipt.dto';
import { IsOptional } from 'class-validator';

export class UpdateGoodsReceiptDto extends PartialType(CreateGoodsReceiptDto) {
  @IsOptional()
  totalAmount: number;
}
