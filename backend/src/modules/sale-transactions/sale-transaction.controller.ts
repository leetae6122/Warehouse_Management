import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { SaleTransactionService } from './sale-transaction.service';
import { CreateSaleTransactionDto } from './dto/create-sale-transaction.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { handleException } from 'src/common/utils/exception.util';
import {
  MSG_ERROR_CREATE,
  MSG_ERROR_GET,
  MSG_ERROR_UPDATE,
} from 'src/common/utils/message.util';
import { UpdateSaleTransactionDto } from './dto/update-sale-transaction.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('sale-transactions')
@ApiBearerAuth('access-token')
@Controller('sale-transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SaleTransactionController {
  constructor(
    private readonly saleTransactionService: SaleTransactionService,
  ) {}

  @Roles('MANAGER', 'STAFF')
  @Post()
  create(
    @User('id') userId: number,
    @Body() createSaleTransactionDto: CreateSaleTransactionDto,
  ) {
    try {
      return this.saleTransactionService.create(
        userId,
        createSaleTransactionDto,
      );
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_CREATE('Sale Transaction'),
      });
    }
  }

  @Roles('ADMIN', 'MANAGER')
  @Get()
  findAll() {
    try {
      return this.saleTransactionService.findAll();
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Sale Transaction'),
      });
    }
  }

  @Roles('MANAGER', 'STAFF')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.saleTransactionService.findOne(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('Sale Transaction'),
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleTransactionDto: UpdateSaleTransactionDto,
    @User() user: UserDto,
  ) {
    try {
      return this.saleTransactionService.update(
        id,
        user,
        updateSaleTransactionDto,
      );
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_UPDATE('Sale Transaction'),
      });
    }
  }
}
