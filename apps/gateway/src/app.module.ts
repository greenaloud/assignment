import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { LoggerModule } from '@app/common';
import { ProxyMiddleware } from './proxy/proxy.middleware';
import { ProxyModule } from './proxy/proxy.module';
import { AuthServiceProxy } from './proxy/auth-service/auth-service.proxy';
import { EventServiceProxy } from './proxy/event-service/event-service.proxy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    LoggerModule,
    ProxyModule.register([AuthServiceProxy, EventServiceProxy]),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
