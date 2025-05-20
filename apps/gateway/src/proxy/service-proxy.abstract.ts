import { PermissionType } from '@app/common/permissions/permissions';
import { Request, Response } from 'express';
import { RequestHandler } from 'http-proxy-middleware';

export type RouteDefinition = {
  path: string;
  method: string;
  authConfig: RouteAuthConfig;
};

export type RouteAuthConfig = {
  isPublic: boolean;
  requiredPermissions?: PermissionType[];
};

export abstract class ServiceProxy {
  private readonly routes: readonly RouteDefinition[];
  private readonly proxyHandler: RequestHandler;

  constructor(
    routes: readonly RouteDefinition[],
    proxyHandler: RequestHandler,
  ) {
    this.routes = routes;
    this.proxyHandler = proxyHandler;
  }

  canHandle(path: string, method: string): boolean {
    return this.routes.some(
      (definition) =>
        this.pathMatches(definition.path, path) && definition.method === method,
    );
  }

  handleRequest(req: Request, res: Response, next: (error?: Error) => void) {
    this.proxyHandler(req, res, next);
  }

  getAuthConfig(path: string, method: string): RouteAuthConfig {
    const routeDefinition = this.routes.find(
      (definition) =>
        this.pathMatches(definition.path, path) && definition.method === method,
    );

    const authConfig = routeDefinition.authConfig;

    return {
      ...authConfig,
      requiredPermissions: authConfig.requiredPermissions ?? [],
    };
  }

  /**
   * 패턴 경로와 실제 경로가 일치하는지 확인
   * 예: /users/:id 패턴은 /users/123과 일치함
   */
  private pathMatches(pattern: string, path: string): boolean {
    if (pattern === path) {
      return true;
    }

    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) {
      return false;
    }

    return patternParts.every((part, index) => {
      // :id와 같은 매개변수는 항상 일치함
      if (part.startsWith(':')) {
        return true;
      }
      return part === pathParts[index];
    });
  }
}
