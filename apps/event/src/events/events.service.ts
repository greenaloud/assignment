import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';
import { ConditionFactoryService } from './condition-factory.service';
import { RewardFactoryService } from './reward-factory.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly conditionFactory: ConditionFactoryService,
    private readonly rewardFactory: RewardFactoryService,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    const processedConditions = await this.conditionFactory.createConditions(
      createEventDto.conditions,
    );
    const processedRewards = await this.rewardFactory.createRewards(
      createEventDto.rewards,
    );

    return this.eventsRepository.create({
      ...createEventDto,
      conditions: processedConditions,
      rewards: processedRewards,
      userId,
    });
  }

  async findAll() {
    return this.eventsRepository.find({});
  }

  async findOne(id: string) {
    return this.eventsRepository.findOne({ _id: id });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventsRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateEventDto },
    );
  }

  async remove(id: string) {
    return this.eventsRepository.deleteById(id);
  }
}
