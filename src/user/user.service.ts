import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/Prisma.service'
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  private async findUserOrThrow(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new HttpException(`USER_NOT_FOUND`, HttpStatus.NOT_FOUND)
    }
    return user
  }

  private async checkUserExists(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })
    if (user) {
      throw new HttpException(`USER_ALREADY_EXISTS`, HttpStatus.BAD_REQUEST)
    }

    return user
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    await this.checkUserExists(createUserDto.email)

    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
        updatedAt: null,
      },
    })

    if (!user) {
      throw new HttpException(`USER_NOT_CREATED`, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    const users = await this.prismaService.user.findMany()
    return users.length ? users : []
  }

  async findOne(id: number) {
    await this.findUserOrThrow(id)
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })

    return user ? user : {}
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserOrThrow(id)
    const update = await this.prismaService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: updateUserDto.password
          ? await bcrypt.hash(updateUserDto.password, 10)
          : user.password,
      },
    })

    if (!update) {
      throw new HttpException(`USER_NOT_UPDATED`, HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    await this.findUserOrThrow(id)
    const remove = await this.prismaService.user.delete({
      where: { id },
    })

    if (!remove) {
      throw new HttpException(`USER_NOT_DELETED`, HttpStatus.BAD_REQUEST)
    }
  }
}
