import { RewardType } from '../../models/event-reward.schema';
import { BaseEventRewardDto } from '../base-event-reward.dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class ItemRewardDto implements BaseEventRewardDto {
  @IsString()
  @IsNotEmpty()
  readonly type: RewardType = RewardType.ITEM;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
