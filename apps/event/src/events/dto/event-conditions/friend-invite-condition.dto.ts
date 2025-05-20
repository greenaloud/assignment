import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { BaseEventConditionDto } from '../base-event-condition.dto';
import { ConditionType } from '../../models/event-condition.schema';

export class FriendInviteConditionDto implements BaseEventConditionDto {
  @IsString()
  @IsNotEmpty()
  readonly type: ConditionType = ConditionType.FRIEND_INVITE;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  requiredInvites: number;
}
