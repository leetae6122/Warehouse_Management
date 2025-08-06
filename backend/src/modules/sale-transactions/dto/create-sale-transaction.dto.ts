import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSaleTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'The item for sale must have at least 1 item' })
  @IsNumber({}, { each: true })
  @ApiProperty({ type: [Number], example: [1, 2] })
  items: number[];
}
