import { BaseDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class EventDocument extends BaseDocument {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  userId: string;
}

export const EventSchema = SchemaFactory.createForClass(EventDocument);
