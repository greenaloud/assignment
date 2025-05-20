import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServiceTokenPayload } from '../../types/service-token-payload.type';
import { UserInfo } from '../../types/user-info.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Unable to find service token');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<ServiceTokenPayload>(token);

      if (payload.authenticated) {
        const { sub, username, role, permissions } = payload;

        request['user'] = {
          id: sub,
          email: username,
          role,
          permissions,
        } as UserInfo;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid service token');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers['x-service-token'];
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
