import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    LoggerModule,
  ],
})
export class AppModule {}
