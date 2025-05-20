import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RewardRequestRepository } from './reward-request.repository';
import { EventsRepository } from '../events/events.repository';
import { Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { RequestStatus } from './schema/reward-request.schema';

@Injectable()
export class RewardRequestService {
  constructor(
    private readonly rewardRequestRepository: RewardRequestRepository,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async requestReward(eventId: string, userId: string) {
    const event = await this.eventsRepository.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const existingRequest = await this.rewardRequestRepository.findOne({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
    });

    if (existingRequest) {
      throw new BadRequestException('Reward already requested for this event');
    }

    // 여기서 이벤트 조건 충족 여부를 검증 및 보상지급 처리

    // 보상 요청 생성 - 완료처리
    const rewardRequest = await this.rewardRequestRepository.create({
      eventId: new MongooseSchema.Types.ObjectId(eventId),
      userId: new MongooseSchema.Types.ObjectId(userId),
      status: RequestStatus.APPROVED,
    });

    return rewardRequest;
  }
}
