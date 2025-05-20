import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsRepository } from './events.repository';
import { Event, EventSchema } from './models/event.schema';
import { CommonAuthModule } from '@app/common/common-auth/common-auth.module';
import {
  RewardRequest,
  RewardRequestSchema,
} from '../reward-request/schema/reward-request.schema';
import {
  LoginStreakCondition,
  LoginStreakConditionSchema,
} from './models/event-conditions/login-streak-condition.schema';
import {
  FriendInviteCondition,
  FriendInviteConditionSchema,
} from './models/event-conditions/friend-invite-condition.schema';
import {
  PointReward,
  PointRewardSchema,
} from './models/event-rewards/point-reward.schema';
import {
  ItemReward,
  ItemRewardSchema,
} from './models/event-rewards/item-reward.schema';
import { ConditionFactoryService } from './condition-factory.service';
import { RewardFactoryService } from './reward-factory.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
        discriminators: [
          {
            name: LoginStreakCondition.name,
            schema: LoginStreakConditionSchema,
          },
          {
            name: FriendInviteCondition.name,
            schema: FriendInviteConditionSchema,
          },
          {
            name: ItemReward.name,
            schema: ItemRewardSchema,
          },
          { name: PointReward.name, schema: PointRewardSchema },
        ],
      },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    CommonAuthModule,
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    EventsRepository,
    ConditionFactoryService,
    RewardFactoryService,
  ],
})
export class EventsModule {}
