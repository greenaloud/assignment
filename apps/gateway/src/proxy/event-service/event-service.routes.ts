import { RouteDefinition } from '../service-proxy.abstract';

export const eventServiceRoutes: RouteDefinition[] = [
  { path: '/events', method: 'POST' },
  { path: '/events', method: 'GET' },
  { path: '/events/:id', method: 'GET' },
  { path: '/events/:id', method: 'PATCH' },
  { path: '/events/:id', method: 'DELETE' },
];
