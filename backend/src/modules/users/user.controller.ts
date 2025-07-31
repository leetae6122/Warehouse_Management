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
  MSG_NOT_FOUND,
  MSG_UPDATED_SUCCESSFUL,
  MSG_USER_EXISTS,
  MSG_USER_NOT_OWNER,
} from 'src/common/utils/message.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';

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
  async update(
    @User('id') userIdReq: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const foundUser = await this.userService.findOne(+id);
    if (!foundUser) {
      throw new BadRequestException(MSG_NOT_FOUND('User'));
    }
    if (foundUser.id !== +userIdReq) {
      throw new BadRequestException(MSG_USER_NOT_OWNER);
    }
    return {
      statusCode: 200,
      message: MSG_UPDATED_SUCCESSFUL('User'),
      data: await this.userService.update(foundUser.id, updateUserDto),
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
  async findOne(@User('id') userIdReq: string, @Param('id') id: string) {
    const foundUser = await this.userService.findOne(+id);
    if (!foundUser) {
      throw new BadRequestException(MSG_NOT_FOUND('User'));
    }
    if (foundUser.id !== +userIdReq) {
      throw new BadRequestException(MSG_USER_NOT_OWNER);
    }
    return {
      statusCode: 200,
      data: foundUser,
    };
  }
}
