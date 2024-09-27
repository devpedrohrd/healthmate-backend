import { Module } from '@nestjs/common'
import { UserModule } from './Application/user/user.module'
import { AuthModule } from './Application/auth/auth.module'
import { MedicamentModule } from './Application/medicament/medicament.module'

@Module({
  imports: [UserModule, AuthModule, MedicamentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
