import { Module } from '@nestjs/common'
import { UserModule } from './Application/user/user.module'
import { AuthModule } from './Application/auth/auth.module'
import { MedicamentModule } from './Application/medicament/medicament.module'
import { ReminderModule } from './Application/reminder/reminder.module'

@Module({
  imports: [UserModule, AuthModule, MedicamentModule, ReminderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
