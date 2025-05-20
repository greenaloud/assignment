import { Controller, Param, Post } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { CurrentUser } from '@app/common/common-auth/decorators/current-user.decorator';
import { UserInfo } from '@app/common/types/user-info.type';

@Controller('reward-requests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post(':eventId')
  async requestReward(
    @Param('eventId') eventId: string,
    @CurrentUser() { id: userId }: UserInfo,
  ) {
    return await this.rewardRequestService.requestReward(eventId, userId);
  }
}
