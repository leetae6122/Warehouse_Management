import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReceiptItemService } from './receipt-item.service';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';
import { UpdateReceiptItemDto } from './dto/update-receipt-item.dto';
import { handleException } from 'src/common/utils/exception.util';
import {
  MSG_DELETED_SUCCESSFUL,
  MSG_ERROR_CREATE,
  MSG_ERROR_DELETE,
  MSG_ERROR_GET,
  MSG_ERROR_UPDATE,
} from 'src/common/utils/message.util';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { FilterCrudDto } from 'src/common/crud/filter/filter-crud.dto';

@ApiTags('receipt-items')
@ApiBearerAuth('access-token')
@Controller('receipt-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceiptItemController {
  constructor(private readonly receiptItemService: ReceiptItemService) {}

  @Post()
  async create(@Body() createReceiptItemDto: CreateReceiptItemDto) {
    try {
      return await this.receiptItemService.create(createReceiptItemDto);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_CREATE('Receipt Item'),
      });
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.receiptItemService.findAll();
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Receipt Item'),
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.receiptItemService.findOne(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Receipt Item'),
      });
    }
  }

  @Get('search')
  async search(@Body() filterDto: FilterCrudDto) {
    try {
      return await this.receiptItemService.getList(filterDto);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Receipt Item'),
      });
    }
  }

  @Get('receipt/:receiptId')
  async findByReceiptId(@Param('receiptId', ParseIntPipe) receiptId: number) {
    try {
      return await this.receiptItemService.findByReceiptId(receiptId);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Receipt Item'),
      });
    }
  }

  @Get('product/:productId')
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    try {
      return await this.receiptItemService.findByProductId(productId);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Receipt Item'),
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReceiptItemDto: UpdateReceiptItemDto,
  ) {
    try {
      return await this.receiptItemService.update(id, updateReceiptItemDto);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_UPDATE('Receipt Item'),
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.receiptItemService.remove(id);
      return {
        statusCode: 200,
        message: MSG_DELETED_SUCCESSFUL,
      };
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_DELETE('Receipt Item'),
      });
    }
  }
}
