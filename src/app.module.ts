import { Module } from '@nestjs/common'
import { UserModule } from './Application/user/user.module'
import { AuthModule } from './Application/auth/auth.module'
import { MedicamentModule } from './Application/medicament/medicament.module'
import { ReminderModule } from './Application/reminder/reminder.module'
import { PatientModule } from './Application/patient/patient.module'
import { FiltersModule } from './filters/filters.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MedicamentModule,
    ReminderModule,
    PatientModule,
    FiltersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
