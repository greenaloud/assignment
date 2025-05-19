import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ServiceProxy } from '../service-proxy.abstract';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { ServiceHost } from '@app/common/constants/services';
import { ConfigService } from '@nestjs/config';
import { eventServiceRoutes } from './event-service.routes';

@Injectable()
export class EventServiceProxy extends ServiceProxy {
  constructor(private readonly configService: ConfigService) {
    const proxyHandler = createProxyMiddleware<Request, Response>({
      target: {
        protocol: 'http:',
        host: ServiceHost.EVENT,
        port: configService.get<number>('EVENT_SERVICE_HTTP_PORT'),
      },
      secure: false,
      on: { proxyReq: fixRequestBody },
      changeOrigin: true,
      timeout: 5000,
    });

    super(eventServiceRoutes, proxyHandler);
  }
}
