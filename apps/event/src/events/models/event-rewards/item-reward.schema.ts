import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RewardType } from '../event-reward.schema';

@Schema({ _id: false })
export class ItemReward {
  type: RewardType = RewardType.ITEM;
  name: string;
  description?: string;

  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  amount: number;
}

export const ItemRewardSchema = SchemaFactory.createForClass(ItemReward);
