import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TransformDtoInterceptor } from '../../common/interceptors/transform-dto.interceptor';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  MSG_CREATED_SUCCESSFUL,
  MSG_UPDATED_SUCCESSFUL,
  MSG_USER_EXISTS,
} from 'src/common/utils/message.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@UseInterceptors(new TransformDtoInterceptor(UserDto))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userExists = await this.userService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException(MSG_USER_EXISTS);
    }
    return {
      statusCode: 201,
      message: MSG_CREATED_SUCCESSFUL('User'),
      data: await this.userService.create(createUserDto),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return {
      statusCode: 200,
      message: MSG_UPDATED_SUCCESSFUL('User'),
      data: await this.userService.update(+id, updateUserDto),
    };
  }

  @Get()
  @Roles('ADMIN')
  async findAll() {
    return {
      statusCode: 200,
      data: await this.userService.findAll(),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      statusCode: 200,
      data: this.userService.findOne(+id),
    };
  }
}
