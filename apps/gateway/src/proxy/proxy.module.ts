import { DynamicModule, Module, Type } from '@nestjs/common';
import { ProxyMiddleware } from './proxy.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceProxy } from './service-proxy.abstract';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceHost } from '@app/common/constants/services';

@Module({})
export class ProxyModule {
  static register(proxies: Type<ServiceProxy>[]): DynamicModule {
    return {
      module: ProxyModule,
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: ServiceHost.AUTH,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.TCP,
              options: {
                host: configService.get('AUTH_SERVICE_HOST'),
                port: configService.get('AUTH_TCP_PORT'),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      providers: [
        ...proxies,
        {
          provide: 'SERVICE_PROXIES',
          useFactory: (...proxies: ServiceProxy[]) => proxies,
          inject: proxies,
        },
        ProxyMiddleware,
      ],
      exports: ['SERVICE_PROXIES', ProxyMiddleware, ClientsModule],
    };
  }
}
