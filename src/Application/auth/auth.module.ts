import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/Application/user/user.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    UserModule,
  ],
})
export class AuthModule {}
