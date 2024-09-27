import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto)
  }

  @Get()
  async findAll() {
    return await this.userService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.update(id, updateUserDto)
    return { message: 'USER_UPDATED_SUCESSFULLY' }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userService.remove(id)

    return { message: 'USER_REMOVED_SUCESSFULLY' }
  }
}
