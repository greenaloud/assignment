import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongoose.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    LoggerModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
