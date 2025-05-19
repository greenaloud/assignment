import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './models/role.schema';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [],
  providers: [RolesRepository],
  exports: [RolesRepository],
})
export class RolesModule {}
