import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ConditionType } from '../event-condition.schema';

@Schema({ _id: false })
export class LoginStreakCondition {
  type: ConditionType = ConditionType.LOGIN_STREAK;
  name: string;
  description?: string;

  @Prop({ required: true })
  requiredDays: number;

  @Prop({ required: true, default: true })
  mustBeConsecutive: boolean;
}

export const LoginStreakConditionSchema =
  SchemaFactory.createForClass(LoginStreakCondition);
