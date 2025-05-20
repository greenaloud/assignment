import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonAuthJwtConfig } from './config/common-auth-jwt.config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [],
  providers: [JwtStrategy],
})
export class CommonAuthModule {}
