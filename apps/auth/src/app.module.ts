import { Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongoose.config';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './database/seeds/seed.module';
import { SeedService } from './database/seeds/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    LoggerModule,
    UsersModule,
    AuthModule,
    SeedModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private seedService: SeedService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await this.seedService.seed();
    }
  }
}
