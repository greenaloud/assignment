import { ConditionType } from '../models/event-condition.schema';

export interface BaseEventConditionDto {
  type: ConditionType;
  name: string;
  description?: string;
}
