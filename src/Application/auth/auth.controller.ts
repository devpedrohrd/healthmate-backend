import { Body, Controller, Post, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/loginDto'
import { Response, Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(email, password)

    return this.authService.login(user, res)
  }

  @Post('refresh-token')
  async refreshToken(@Res() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res)
  }
}
