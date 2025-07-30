import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MSG_NOT_FOUND } from 'src/common/utils/message.util';
import { CategoryDto } from './dto/category.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    const foundCategory = (await this.categoryService.findOne(
      +id,
    )) as CategoryDto;
    if (!foundCategory) {
      throw new NotFoundException(MSG_NOT_FOUND('Category'));
    }
    return await this.categoryService.update(
      foundCategory.id,
      updateCategoryDto,
    );
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
}
