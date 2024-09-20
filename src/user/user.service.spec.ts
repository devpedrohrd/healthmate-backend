import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../user/user.service'
import { PrismaService } from '../Prisma.service'
import { HttpException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto'

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'), // Mock da função hash
  compare: jest.fn().mockResolvedValue(true), // Mock da função compare
}))

describe('UserService', () => {
  let service: UserService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile()

    service = module.get<UserService>(UserService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  const updateUser: UpdateUserDto = {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password789',
    phone: '7777777777',
    role: 'PROFESSIONAL',
    age: 25,
    gender: 'MALE',
    endereco: {
      street: '789 Oak St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
    image: '',
    isActive: false,
    createdAt: undefined,
    updatedAt: undefined,
  }

  const createUser: CreateUserDto = {
    id: 3,
    name: 'Test User',
    email: 'test@example.com',
    password: 'qweqweqwe',
    phone: '9999999999',
    role: 'PROFESSIONAL',
    age: 0,
    gender: 'MALE',
    endereco: '',
    image: '',
    isActive: false,
    createdAt: undefined,
    updatedAt: undefined,
  }

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createUser)
    })

    it('should throw an error if user already exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(createUser)
      await expect(service.create(createUser)).rejects.toThrow(
        new HttpException(`USER_ALREADY_EXISTS`, 400),
      )
    })

    it('should throw an error if user is not created', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(null)
      await expect(service.create(createUser)).rejects.toThrow(
        new HttpException(`USER_NOT_CREATED`, 400),
      )
    })

    it('should create a user with hashed password', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createUser)
      await service.create(createUser)
      expect(bcrypt.hash).toHaveBeenCalledWith(createUser.password, 10)
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: CreateUserDto[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '9999999999',
          role: 'PROFESSIONAL',
          age: 30,
          gender: 'MALE',
          endereco: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
          },
          image: '',
          isActive: true,
          createdAt: undefined,
          updatedAt: undefined,
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'password456',
          phone: '8888888888',
          role: 'ADMIN',
          age: 28,
          gender: 'FEMALE',
          endereco: {
            street: '456 Elm St',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
          },
          image: '',
          isActive: true,
          createdAt: undefined,
          updatedAt: undefined,
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          password: 'password789',
          phone: '7777777777',
          role: 'PROFESSIONAL',
          age: 25,
          gender: 'MALE',
          endereco: {
            street: '789 Oak St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
          },
          image: '',
          isActive: false,
          createdAt: undefined,
          updatedAt: undefined,
        },
      ]

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users)

      expect(await service.findAll()).toEqual(users)
    })

    it('should return an empty array if no users are found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue([])
      expect(await service.findAll()).toEqual([])
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(createUser)

      expect(await service.findOne(3)).toEqual(createUser)
    })

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null)

      await expect(service.findOne(3)).rejects.toThrow(
        new HttpException(`USER_NOT_FOUND`, 400),
      )
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updateUser)
    })

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null)
      await expect(service.update(3, updateUser)).rejects.toThrow(
        new HttpException(`USER_NOT_FOUND`, 400),
      )
    })

    it('should update a user with hashed password', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(updateUser)
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updateUser)
      await service.update(3, updateUser)
      expect(bcrypt.hash).toHaveBeenCalledWith(updateUser.password, 10)
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(createUser)
    })

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null)
      await expect(service.remove(3)).rejects.toThrow(
        new HttpException(`USER_NOT_FOUND`, 400),
      )
    })
  })
})
