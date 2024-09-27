import { HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { UserService } from 'src/Application/user/user.service'
import { Response, Request } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.validateUser(email, password)

    if (user) {
      return user
    }

    throw new HttpException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED)
  }

  async login(user: User, @Res() res: Response) {
    const payload = { email: user.email, sub: user.id, role: user.role }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    })

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 900000),
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 604800000),
    })

    return { message: 'LOGIN_SUCCESS' }
  }

  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token']

    if (!refreshToken) {
      throw new HttpException('REFRESH_TOKEN_NOT_FOUND', HttpStatus.NOT_FOUND)
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      })

      const payload = {
        email: decoded.email,
        sub: decoded.sub,
        role: decoded.role,
      }

      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      })

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 900000),
      })

      res.send({ message: 'REFRESH_TOKEN_SUCCESS' })
    } catch (e) {
      console.error(e)

      throw new HttpException('REFRESH_TOKEN_INVALID', HttpStatus.UNAUTHORIZED)
    }
  }
}
