import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { BaseEventConditionDto } from './base-event-condition.dto';
import { BaseEventRewardDto } from './base-event-reward.dto';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsArray()
  conditions: BaseEventConditionDto[];

  @IsArray()
  rewards: BaseEventRewardDto[];
}
