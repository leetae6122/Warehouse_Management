import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { handleException } from 'src/common/utils/exception.util';
import {
  MSG_ERROR_CREATE,
  MSG_ERROR_GET,
  MSG_ERROR_UPDATE,
} from 'src/common/utils/message.util';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Roles('ADMIN', 'MANAGER')
  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    try {
      return await this.supplierService.create(createSupplierDto);
    } catch (error: unknown) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_CREATE('supplier'),
      });
    }
  }

  @Roles('ADMIN', 'MANAGER')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    try {
      return await this.supplierService.update(+id, updateSupplierDto);
    } catch (error: unknown) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_UPDATE('supplier'),
      });
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.supplierService.findAll();
    } catch (error: unknown) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('suppliers'),
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.supplierService.findOne(+id);
    } catch (error: unknown) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('supplier'),
      });
    }
  }
}
