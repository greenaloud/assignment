import { RouteDefinition } from '../service-proxy.abstract';

export const authServiceRoutes: RouteDefinition[] = [
  { path: '/auth/login', method: 'POST' },
  { path: '/users', method: 'POST' },
  { path: '/users/me', method: 'GET' },
];
