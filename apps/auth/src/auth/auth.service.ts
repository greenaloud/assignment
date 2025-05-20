import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDocument } from '../users/models/user.schema';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { PermissionType } from '@app/common/permissions/permissions';
import { UsersRepository } from '../users/users.repository';
import { ServiceToken } from '@app/common/constants/service.tokens';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async getUserByAuthToken(authenticationToken: string): Promise<UserDocument> {
    try {
      const { userId } = this.jwtService.verify(authenticationToken, {
        secret: this.configService.get('JWT_AUTH_SECRET'),
        ignoreExpiration: false,
      });

      if (!userId) {
        throw new UnauthorizedException('Invalid token: missing userId claim');
      }

      const user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await user.populate('role');

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }

  createAnonymousServiceToken(): string {
    const payload = this.getBaseTokenPayload();

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  createAuthenticatedServiceToken(
    user: UserDocument,
    permissions: PermissionType[],
  ): string {
    const userPermissions = user.role.permissions;

    const isAllowed = permissions.every((p) => userPermissions.includes(p));
    if (!isAllowed) {
      throw new ForbiddenException('Not enough permissions');
    }

    const payload = this.getBaseTokenPayload({ user, permissions });
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SERVICE_SECRET'),
    });
  }

  private getBaseTokenPayload(input?: {
    user: UserDocument;
    permissions: PermissionType[];
  }) {
    const user = input?.user;
    const permissions = user?.role.permissions;

    return {
      iss: ServiceToken.AUTH,
      sub: user?._id || 'anonymous',
      aud: 'internal-services',
      jti: uuidv4(),

      authenticated: user ? true : false,
      username: user?.email,
      role: user?.role.name,
      permissions: permissions || [],
    };
  }
}
