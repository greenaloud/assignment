import { PermissionType } from '../permissions/permissions';
import { SystemRole } from '../permissions/roles';

export type UserInfo = {
  id: string;
  email: string;
  role: SystemRole;
  permissions: PermissionType[];
};
