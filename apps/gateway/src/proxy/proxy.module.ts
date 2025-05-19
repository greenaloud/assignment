import { DynamicModule, Module, Type } from '@nestjs/common';
import { ProxyMiddleware } from './proxy.middleware';
import { ConfigModule } from '@nestjs/config';
import { ServiceProxy } from './service-proxy.abstract';

@Module({})
export class ProxyModule {
  static register(proxies: Type<ServiceProxy>[]): DynamicModule {
    return {
      module: ProxyModule,
      imports: [ConfigModule],
      providers: [
        ...proxies,
        {
          provide: 'SERVICE_PROXIES',
          useFactory: (...proxies: ServiceProxy[]) => proxies,
          inject: proxies,
        },
        ProxyMiddleware,
      ],
      exports: ['SERVICE_PROXIES', ProxyMiddleware],
    };
  }
}
