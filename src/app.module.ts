import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfessionalModule } from './professional/professional.module';

@Module({
  imports: [UserModule, AuthModule, ProfessionalModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
