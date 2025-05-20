import { BaseRepository } from '@app/common';
import {
  RewardRequest,
  RewardRequestDocument,
} from './schema/reward-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class RewardRequestRepository extends BaseRepository<
  RewardRequest,
  RewardRequestDocument
> {
  constructor(
    @InjectModel(RewardRequest.name) rewardRequestModel: Model<RewardRequest>,
  ) {
    super(rewardRequestModel);
  }
}
