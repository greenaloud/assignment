import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventCondition, EventConditionSchema } from './event-condition.schema';
import { EventReward, EventRewardSchema } from './event-reward.schema';

export type EventDocument = HydratedDocument<Event>;

export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Event {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: [EventConditionSchema] })
  conditions: EventCondition[];

  @Prop({ type: [EventRewardSchema] })
  rewards: EventReward[];

  @Prop()
  userId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.virtual('status').get(function () {
  const now = new Date();

  if (now < this.startDate) {
    return EventStatus.SCHEDULED;
  } else if (now > this.endDate) {
    return EventStatus.ENDED;
  } else {
    return EventStatus.ACTIVE;
  }
});
