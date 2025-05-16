import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    LoggerModule,
    UsersModule,
  ],
})
export class AppModule {}
