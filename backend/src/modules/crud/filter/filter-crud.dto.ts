import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class FilterCrudDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 1 })
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 10 })
  size: number;

  @IsOptional()
  @ApiProperty({ required: false })
  where?: object;

  @IsOptional()
  @ApiProperty({ required: false })
  select?: object;

  @IsOptional()
  @ApiProperty({ required: false })
  include?: object;

  @IsOptional()
  @ApiProperty({ required: false })
  orderBy?: object;
}
