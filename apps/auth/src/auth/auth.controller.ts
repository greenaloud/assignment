import {
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UserDocument } from '../users/models/user.schema';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionType } from '@app/common/permissions/permissions';

type RouteAuthConfig = {
  isPublic: boolean;
  requiredPermissions?: PermissionType[];
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @MessagePattern({ cmd: 'verify-permissions' })
  async verifyPermissions(
    @Payload()
    data: {
      authConfig: RouteAuthConfig;
      authenticationToken?: string;
    },
  ) {
    const { authConfig, authenticationToken } = data;
    const { isPublic, requiredPermissions } = authConfig;

    // 비공개 API, 토큰 없음 → 401 즉시 반환
    if (!isPublic && !authenticationToken) {
      throw new UnauthorizedException('Authentication token is required');
    }

    // 공개 API, 토큰 없음 → 익명 토큰 발급
    if (!authenticationToken) {
      return this.authService.createAnonymousServiceToken();
    }

    const user = await this.authService.getUserByAuthToken(authenticationToken);

    return this.authService.createAuthenticatedServiceToken(
      user,
      requiredPermissions,
    );
  }
}
