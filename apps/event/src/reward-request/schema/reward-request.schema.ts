import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RewardRequestDocument = HydratedDocument<RewardRequest>;

export enum RequestStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: RequestStatus,
    required: true,
  })
  status: RequestStatus;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
