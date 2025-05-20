import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum RewardType {
  POINT = 'POINT',
  ITEM = 'ITEM',
}

@Schema({ _id: false, discriminatorKey: 'type' })
export class EventReward {
  @Prop({
    type: String,
    enum: RewardType,
    required: true,
  })
  type: RewardType;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventReward);
