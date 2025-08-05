import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class CreateGoodsReceiptDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  supplierId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'The receipt must contain at least 1 item' })
  @IsNumber({}, { each: true })
  @ApiProperty({ type: [Number], example: [1, 2] })
  items: number[];
}
