import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { normalizeStringDto } from 'src/common/utils/func.util';

export class CreateCategoryDto {
  @MaxLength(70)
  @IsString()
  @Transform(normalizeStringDto)
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
