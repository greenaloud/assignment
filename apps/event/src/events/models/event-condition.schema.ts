import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ConditionType {
  LOGIN_STREAK = 'LOGIN_STREAK',
  FRIEND_INVITE = 'FRIEND_INVITE',
}

@Schema({ _id: false, discriminatorKey: 'type' })
export class EventCondition {
  @Prop({
    type: String,
    enum: ConditionType,
    required: true,
  })
  type: ConditionType;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const EventConditionSchema =
  SchemaFactory.createForClass(EventCondition);
