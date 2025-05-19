import {
  createProxyMiddleware,
  fixRequestBody,
  RequestHandler,
} from 'http-proxy-middleware';
import type { Request, Response } from 'express';
import { AUTH_SERVICE } from '@app/common/constants/services';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthProxyMiddleware implements NestMiddleware {
  private authProxy: RequestHandler;

  constructor(private readonly configService: ConfigService) {
    this.authProxy = createProxyMiddleware<Request, Response>({
      target: {
        protocol: 'http:',
        host: AUTH_SERVICE,
        port: this.configService.get<number>('AUTH_HTTP_PORT'),
      },
      secure: false,
      on: { proxyReq: fixRequestBody },
      changeOrigin: true,
      timeout: 5000,
    });
  }

  use(req: Request, res: Response, next: (error?: Error) => void) {
    this.authProxy(req, res, next);
  }
}
