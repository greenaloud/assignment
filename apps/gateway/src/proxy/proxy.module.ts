import { Module } from '@nestjs/common';
import { ProxyMiddleware } from './proxy.middleware';
import { AuthServiceProxy } from './auth-service/auth-service.proxy';

@Module({
  providers: [
    AuthServiceProxy,
    {
      provide: 'SERVICE_PROXIES',
      useFactory: (authProxy: AuthServiceProxy) => [authProxy],
      inject: [AuthServiceProxy],
    },
    ProxyMiddleware,
  ],
  exports: ['SERVICE_PROXIES', ProxyMiddleware],
})
export class ProxyModule {}
