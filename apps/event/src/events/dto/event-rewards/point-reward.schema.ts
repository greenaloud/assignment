import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { BaseEventRewardDto } from '../../dto/base-event-reward.dto';
import { RewardType } from '../../models/event-reward.schema';

export class PointRewardDto implements BaseEventRewardDto {
  @IsString()
  @IsNotEmpty()
  readonly type: RewardType = RewardType.POINT;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  value: number;
}
