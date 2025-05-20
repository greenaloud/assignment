import { RouteDefinition } from '../service-proxy.abstract';

export const authServiceRoutes: RouteDefinition[] = [
  { path: '/auth/login', method: 'POST', authConfig: { isPublic: true } },
  { path: '/users', method: 'POST', authConfig: { isPublic: true } },
  {
    path: '/users/me',
    method: 'GET',
    authConfig: { isPublic: true },
  },
];
