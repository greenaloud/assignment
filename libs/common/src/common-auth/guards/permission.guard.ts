import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionType } from '../../permissions/permissions';
import { UserInfo } from '../../types/user-info.type';
import { PERMISSION_METADATA_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSION_METADATA_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserInfo;
    const userPermissions = user.permissions;

    return this.hasRequiredPermissions(requiredPermissions, userPermissions);
  }

  private hasRequiredPermissions(
    requiredPermissions: PermissionType[],
    userPermissions: PermissionType[],
  ): boolean {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Not enough permissions');
    }

    return true;
  }
}
