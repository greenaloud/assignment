import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    LoggerModule,
    EventsModule,
  ],
})
export class AppModule {}
