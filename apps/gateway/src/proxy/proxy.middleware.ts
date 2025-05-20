import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServiceProxy } from './service-proxy.abstract';
import { ServiceToken } from '@app/common/constants/service.tokens';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(
    @Inject('SERVICE_PROXIES') private readonly serviceProxies: ServiceProxy[],
    @Inject(ServiceToken.AUTH) private readonly authClient: ClientProxy,
  ) {}

  async use(req: Request, res: Response, next: (error?: Error) => void) {
    const { path, method } = req;

    const matchingProxy = this.serviceProxies.find((handler) =>
      handler.canHandle(path, method),
    );

    if (!matchingProxy) {
      next();
      return;
    }

    const authConfig = matchingProxy.getAuthConfig(path, method);

    const jwt = req.cookies?.Authentication;

    const serviceToken = await firstValueFrom(
      this.authClient
        .send<string>(
          { cmd: 'verify-permissions' },
          { authenticationToken: jwt, authConfig },
        )
        .pipe(
          timeout(5000),
          catchError((error) => {
            throw new RpcException(error);
          }),
        ),
    );

    req.headers['x-service-token'] = serviceToken;

    matchingProxy.handleRequest(req, res, next);
  }
}
