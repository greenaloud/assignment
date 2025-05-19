import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServiceProxy } from './service-proxy.abstract';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(
    @Inject('SERVICE_PROXIES') private readonly serviceProxies: ServiceProxy[],
  ) {}

  use(req: Request, res: Response, next: (error?: Error) => void) {
    const path = req.path;
    const method = req.method;

    const matchingProxy = this.serviceProxies.find((handler) =>
      handler.canHandle(path, method),
    );

    if (!matchingProxy) {
      next();
      return;
    }

    matchingProxy.handleRequest(req, res, next);
  }
}
