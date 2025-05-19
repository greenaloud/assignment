import { PermissionType } from '@app/common/permissions/permissions';
import { SystemRole } from '@app/common/permissions/roles';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ enum: SystemRole, required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [String],
    enum: Object.values(PermissionType),
    default: [],
  })
  permissions: PermissionType[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
