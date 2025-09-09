import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { GoodsReceiptService } from './goods-receipt.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { User } from 'src/common/decorators/user.decorator';
import { handleException } from 'src/common/utils/exception.util';
import {
  MSG_ERROR_CREATE,
  MSG_ERROR_GET,
  MSG_ERROR_UPDATE,
} from 'src/common/utils/message.util';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('goods-receipts')
@ApiBearerAuth('access-token')
@Controller('goods-receipts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoodsReceiptController {
  constructor(private readonly goodsReceiptService: GoodsReceiptService) {}

  @Roles('MANAGER', 'STAFF')
  @Post()
  async create(
    @Body() createGoodsReceiptDto: CreateGoodsReceiptDto,
    @User('id') userId: number,
  ) {
    try {
      return await this.goodsReceiptService.create(
        userId,
        createGoodsReceiptDto,
      );
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_CREATE('Goods Receipt'),
      });
    }
  }

  @Roles('ADMIN', 'MANAGER')
  @Get()
  findAll() {
    try {
      return this.goodsReceiptService.findAll();
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Goods Receipt'),
      });
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.goodsReceiptService.findOne(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Goods Receipt'),
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserDto,
    @Body() updateGoodsReceiptDto: UpdateGoodsReceiptDto,
  ) {
    try {
      return await this.goodsReceiptService.update(
        id,
        user,
        updateGoodsReceiptDto,
      );
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_UPDATE('Goods Receipt'),
      });
    }
  }
}
