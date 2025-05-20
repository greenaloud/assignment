import { PermissionType } from '@app/common/permissions/permissions';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const PERMISSION_METADATA_KEY = 'PERMISSION';

const setPermissionMetadata = (...permissions: PermissionType[]) =>
  SetMetadata(PERMISSION_METADATA_KEY, permissions);

export const RequirePermissions = (...permissionTypes: PermissionType[]) => {
  return applyDecorators(
    setPermissionMetadata(...permissionTypes),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};
