import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { LoggerModule } from '@app/common';
import { AuthProxyMiddleware } from './middleware/auth-proxy.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthProxyMiddleware)
      .forRoutes({ path: '/auth/login', method: RequestMethod.POST });
  }
}
