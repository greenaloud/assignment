import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Min,
  IsOptional,
} from 'class-validator';
import { BaseEventConditionDto } from '../base-event-condition.dto';
import { ConditionType } from '../../models/event-condition.schema';

export class LoginStreakConditionDto implements BaseEventConditionDto {
  @IsString()
  @IsNotEmpty()
  readonly type: ConditionType = ConditionType.LOGIN_STREAK;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  requiredDays: number;

  @IsBoolean()
  @IsOptional()
  mustBeConsecutive: boolean = true;
}
