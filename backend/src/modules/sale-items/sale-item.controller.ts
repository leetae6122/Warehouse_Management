import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SaleItemsService } from './sale-item.service';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { handleException } from 'src/common/utils/exception.util';
import {
  MSG_ERROR_CREATE,
  MSG_ERROR_DELETE,
  MSG_ERROR_GET,
  MSG_ERROR_UPDATE,
} from 'src/common/utils/message.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('sale-items')
@ApiBearerAuth('access-token')
@Controller('sale-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  @Post()
  create(@Body() createSaleItemDto: CreateSaleItemDto) {
    try {
      return this.saleItemsService.create(createSaleItemDto);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_CREATE('Sale Item'),
      });
    }
  }

  @Get()
  findAll() {
    try {
      return this.saleItemsService.findAll();
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Sale Item'),
      });
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.saleItemsService.findOne(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Sale Item'),
      });
    }
  }

  @Get('transaction/:transactionId')
  async findByTransactionId(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ) {
    try {
      return await this.saleItemsService.findByTransactionId(transactionId);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Sale Item'),
      });
    }
  }

  @Get('product/:productId')
  async findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    try {
      return await this.saleItemsService.findByProductId(productId);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('receipt item'),
      });
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleItemDto: UpdateSaleItemDto,
  ) {
    try {
      return this.saleItemsService.update(id, updateSaleItemDto);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_UPDATE('Sale Item'),
      });
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.saleItemsService.remove(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_DELETE('Sale Item'),
      });
    }
  }
}
