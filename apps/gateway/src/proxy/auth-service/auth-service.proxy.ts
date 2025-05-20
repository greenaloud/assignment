import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import type { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceProxy } from '../service-proxy.abstract';
import { authServiceRoutes } from './auth-service.routes';

@Injectable()
export class AuthServiceProxy extends ServiceProxy {
  constructor(private readonly configService: ConfigService) {
    const proxyHandler = createProxyMiddleware<Request, Response>({
      target: {
        protocol: 'http:',
        host: configService.get<string>('AUTH_SERVICE_HOST'),
        port: configService.get<number>('AUTH_SERVICE_HTTP_PORT'),
      },
      secure: false,
      on: { proxyReq: fixRequestBody },
      changeOrigin: true,
      timeout: 5000,
    });

    super(authServiceRoutes, proxyHandler);
  }
}
