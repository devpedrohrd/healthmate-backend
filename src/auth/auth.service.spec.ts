import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/Prisma.service'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Response, Request } from 'express'

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let jwtService: JwtService

  const mockUserService = {
    validateUser: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(), // Aqui utilizamos jest.fn() para poder mockar o comportamento do método
    verify: jest.fn(),
  }

  const mockResponse = () => {
    const res: Partial<Response> = {}
    res.cookie = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    return res
  }

  const mockRequest = {
    cookies: { refresh_token: 'valid_refresh_token' },
  } as unknown as Request

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('validateUser', () => {
    it('should return a user when credentials are valid', async () => {
      const mockUser = {
        email: 'test@example.com',
        id: 1,
        role: 'user',
      }
      mockUserService.validateUser.mockResolvedValue(mockUser)

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      )
      expect(result).toEqual(mockUser)
    })

    it('should throw an exception when credentials are invalid', async () => {
      mockUserService.validateUser.mockResolvedValue(null)

      await expect(
        authService.validateUser('invalid@example.com', 'wrongpassword'),
      ).rejects.toThrow(
        new HttpException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED),
      )
    })
  })
})
