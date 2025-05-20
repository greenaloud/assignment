import { PermissionType } from '../permissions/permissions';

export type ServiceTokenPayload = {
  iss: string;
  sub: string;
  aud: string;
  jti: string;
  authenticated: boolean;
  username?: string;
  role?: string;
  permissions: PermissionType[];
};
