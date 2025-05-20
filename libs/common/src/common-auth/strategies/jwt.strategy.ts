import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ServiceTokenPayload } from '@app/common/types/service-token-payload.type';
import { UserInfo } from '@app/common/types/user-info.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.headers?.['x-service-token'] as string,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: ServiceTokenPayload): Promise<UserInfo> {
    const { sub, username, role, permissions } = payload;

    return { id: sub, email: username, role, permissions } as UserInfo;
  }
}
