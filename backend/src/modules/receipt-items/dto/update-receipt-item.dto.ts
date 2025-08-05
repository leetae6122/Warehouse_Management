import { PartialType } from '@nestjs/swagger';
import { CreateReceiptItemDto } from './create-receipt-item.dto';

export class UpdateReceiptItemDto extends PartialType(CreateReceiptItemDto) {}
