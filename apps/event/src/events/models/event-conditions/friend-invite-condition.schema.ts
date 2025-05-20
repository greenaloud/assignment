import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConditionType } from '../event-condition.schema';

@Schema({ _id: false })
export class FriendInviteCondition {
  type: ConditionType = ConditionType.FRIEND_INVITE;
  name: string;
  description?: string;

  @Prop({ required: true })
  requiredInvites: number;
}

export const FriendInviteConditionSchema = SchemaFactory.createForClass(
  FriendInviteCondition,
);
