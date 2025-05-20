import { PermissionType } from '@app/common/permissions/permissions';
import { RouteDefinition } from '../service-proxy.abstract';

export const eventServiceRoutes: RouteDefinition[] = [
  {
    path: '/events',
    method: 'POST',
    authConfig: {
      isPublic: false,
      requiredPermissions: [PermissionType.EVENT_WRITE],
    },
  },
  { path: '/events', method: 'GET', authConfig: { isPublic: true } },
  { path: '/events/:id', method: 'GET', authConfig: { isPublic: true } },
  {
    path: '/events/:id',
    method: 'PATCH',
    authConfig: {
      isPublic: false,
      requiredPermissions: [PermissionType.EVENT_WRITE],
    },
  },
  {
    path: '/events/:id',
    method: 'DELETE',
    authConfig: {
      isPublic: false,
      requiredPermissions: [PermissionType.EVENT_DELETE],
    },
  },
];
