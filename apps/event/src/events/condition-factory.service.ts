// condition-factory.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseEventConditionDto } from './dto/base-event-condition.dto';
import { ConditionType } from './models/event-condition.schema';
import { LoginStreakConditionDto } from './dto/event-conditions/login-streak-condition.dto';
import { FriendInviteConditionDto } from './dto/event-conditions/friend-invite-condition.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ConditionFactoryService {
  async createConditions(
    dtos: BaseEventConditionDto[],
  ): Promise<BaseEventConditionDto[]> {
    const verifiedDtos = [];

    for (const dto of dtos) {
      if (!dto.type) {
        throw new BadRequestException('Condition type is required');
      }

      let conditionDto;

      switch (dto.type) {
        case ConditionType.LOGIN_STREAK:
          conditionDto = plainToInstance(LoginStreakConditionDto, dto);
          break;
        case ConditionType.FRIEND_INVITE:
          conditionDto = plainToInstance(FriendInviteConditionDto, dto);
          break;
        default:
          throw new BadRequestException(`Unknown condition type: ${dto.type}`);
      }

      const errors = await validate(conditionDto);
      if (errors.length > 0) {
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

      verifiedDtos.push(conditionDto);
    }

    return verifiedDtos;
  }
}
