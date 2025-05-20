import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RewardRequestDocument = HydratedDocument<RewardRequest>;

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
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
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Prop({ default: () => new Date() })
  requestedAt: Date;

  @Prop()
  processedAt: Date;

  @Prop()
  processedBy: string;

  @Prop()
  rejectionReason: string;

  @Prop({ type: Object })
  verificationData: Record<string, any>;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
