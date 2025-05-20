import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventReward, RewardType } from '../event-reward.schema';

@Schema({ _id: false })
export class PointReward extends EventReward {
  type: RewardType = RewardType.POINT;
  name: string;
  description?: string;

  @Prop({ required: true })
  value: number;
}

export const PointRewardSchema = SchemaFactory.createForClass(PointReward);
