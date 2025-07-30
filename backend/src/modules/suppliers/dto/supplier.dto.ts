import { Supplier } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SupplierDto implements Supplier {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contactInfo: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
