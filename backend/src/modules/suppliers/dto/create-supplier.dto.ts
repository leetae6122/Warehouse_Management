import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @MaxLength(100)
  @IsOptional()
  @IsString()
  @ApiProperty()
  contactInfo?: string;
}
