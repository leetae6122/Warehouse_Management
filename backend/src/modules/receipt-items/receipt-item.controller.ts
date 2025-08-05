import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReceiptItemsService } from './receipt-item.service';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';
import { UpdateReceiptItemDto } from './dto/update-receipt-item.dto';
import { handleException } from 'src/common/utils/exception.util';
import {
  MSG_ERROR_CREATE,
  MSG_ERROR_DELETE,
  MSG_ERROR_GET,
  MSG_ERROR_UPDATE,
} from 'src/common/utils/message.util';

@ApiTags('receipt-items')
@Controller('receipt-items')
export class ReceiptItemsController {
  constructor(private readonly receiptItemsService: ReceiptItemsService) {}

  @Post()
  async create(@Body() createReceiptItemDto: CreateReceiptItemDto) {
    try {
      return await this.receiptItemsService.create(createReceiptItemDto);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_CREATE('receipt item'),
      });
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.receiptItemsService.findAll();
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('receipt item'),
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.receiptItemsService.findOne(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('receipt item'),
      });
    }
  }

  @Get('receipt/:receiptId')
  async findByReceiptId(@Param('receiptId', ParseIntPipe) receiptId: number) {
    try {
      return await this.receiptItemsService.findByReceiptId(receiptId);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('receipt item'),
      });
    }
  }

  @Get('product/:productId')
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    try {
      return await this.receiptItemsService.findByProductId(productId);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('receipt item'),
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReceiptItemDto: UpdateReceiptItemDto,
  ) {
    try {
      return await this.receiptItemsService.update(id, updateReceiptItemDto);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_UPDATE('receipt item'),
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.receiptItemsService.remove(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_DELETE('receipt item'),
      });
    }
  }
}
