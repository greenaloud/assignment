import {
  createProxyMiddleware,
  fixRequestBody,
  RequestHandler,
} from 'http-proxy-middleware';
import type { Request, Response } from 'express';
import { ServiceHost } from '@app/common/constants/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventProxyMiddleware implements NestMiddleware {
  private eventProxy: RequestHandler;

  constructor(private readonly configService: ConfigService) {
    this.eventProxy = createProxyMiddleware<Request, Response>({
      target: {
        protocol: 'http:',
        host: ServiceHost.EVENT,
        port: this.configService.get<number>('EVENT_SERVICE_HTTP_PORT'),
      },
      secure: false,
      on: { proxyReq: fixRequestBody },
      changeOrigin: true,
      timeout: 5000,
    });
  }

  use(req: Request, res: Response, next: (error?: Error) => void) {
    this.eventProxy(req, res, next);
  }
}
