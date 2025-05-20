// condition-factory.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseEventRewardDto } from './dto/base-event-reward.dto';
import { RewardType } from './models/event-reward.schema';
import { PointRewardDto } from './dto/event-rewards/point-reward.schema';
import { ItemRewardDto } from './dto/event-rewards/item-reward.schema';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class RewardFactoryService {
  // 비동기 함수로 변경
  async createRewards(
    dtos: BaseEventRewardDto[],
  ): Promise<BaseEventRewardDto[]> {
    const verifiedDtos = [];

    for (const dto of dtos) {
      if (!dto.type) {
        throw new BadRequestException('Reward type is required');
      }

      let rewardDto;

      switch (dto.type) {
        case RewardType.POINT:
          rewardDto = plainToInstance(PointRewardDto, dto);
          break;
        case RewardType.ITEM:
          rewardDto = plainToInstance(ItemRewardDto, dto);
          break;
        default:
          throw new BadRequestException(`Unknown reward type: ${dto.type}`);
      }

      // 검증 로직을 공통화
      const errors = await validate(rewardDto);
      if (errors.length > 0) {
        // 자세한 오류 메시지 제공
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];
          return `${error.property}: ${constraints.join(', ')}`;
        });

        throw new BadRequestException(
          `Validation failed for ${dto.type}: ${formattedErrors.join('; ')}`,
        );
      }

      verifiedDtos.push(rewardDto);
    }

    return verifiedDtos;
  }
}
