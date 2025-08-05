import { FileService } from './../files/file.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import appConfig from 'src/config/app.config';
import { handleException } from 'src/common/utils/exception.util';
import {
  MSG_ERROR_CREATE,
  MSG_ERROR_GET,
  MSG_ERROR_UPDATE,
} from 'src/common/utils/message.util';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor(
      'image',
      FileService.multerOptions({
        fileSize: 5,
        folder: 'products',
      }),
    ),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const imageUrl =
          appConfig().upload.domain +
          file.path.slice(file.path.indexOf('uploads'));
        createProductDto.imageUrl = imageUrl;
      }
      return await this.productService.create(createProductDto);
    } catch (error: unknown) {
      if (file) {
        this.fileService.deleteFile(file.path, 'products');
      }
      throw handleException(error, {
        defaultMessage: MSG_ERROR_CREATE('product'),
      });
    }
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor(
      'image',
      FileService.multerOptions({
        fileSize: 5,
        folder: 'products',
      }),
    ),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const imageUrl =
          appConfig().upload.domain +
          file.path.slice(file.path.indexOf('uploads'));
        updateProductDto.imageUrl = imageUrl;
      }
      return this.productService.update(id, updateProductDto);
    } catch (error: unknown) {
      if (file) {
        this.fileService.deleteFile(file.path, 'products');
      }
      throw handleException(error, {
        defaultMessage: MSG_ERROR_UPDATE('product'),
      });
    }
  }

  @Get()
  findAll() {
    try {
      return this.productService.findAll();
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('products'),
      });
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.productService.findOne(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('product'),
      });
    }
  }

  @Get(':id/stock')
  getStock(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.productService.getStock(id);
    } catch (error) {
      throw handleException(error, {
        defaultMessage: MSG_ERROR_GET('product stock'),
      });
    }
  }
}
