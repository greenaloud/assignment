import { RewardType } from '../models/event-reward.schema';

export interface BaseEventRewardDto {
  type: RewardType;
  name: string;
  description?: string;
}
