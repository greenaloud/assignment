import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonAuthJwtConfig } from './config/common-auth-jwt.config';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [JwtModule.registerAsync({ useClass: CommonAuthJwtConfig })],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class CommonAuthModule {}
