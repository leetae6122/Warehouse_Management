import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {
  @MaxLength(60)
  @IsNotEmpty()
  @IsString()
  name: string;

  @MaxLength(100)
  @IsOptional()
  @IsString()
  contactInfo?: string;
}
