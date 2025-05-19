import { BaseRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './models/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesRepository extends BaseRepository<Role, RoleDocument> {
  constructor(@InjectModel(Role.name) roleModel: Model<Role>) {
    super(roleModel);
  }
}
