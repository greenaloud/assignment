import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  create(createEventDto: CreateEventDto) {
    return this.eventsRepository.create({
      ...createEventDto,
      userId: '123',
    });
  }

  findAll() {
    return this.eventsRepository.find({});
  }

  findOne(_id: string) {
    return this.eventsRepository.findOne({ _id });
  }

  update(_id: string, updateEventDto: UpdateEventDto) {
    return this.eventsRepository.findOneAndUpdate(
      { _id },
      { $set: updateEventDto },
    );
  }

  remove(_id: string) {
    return this.eventsRepository.findOneAndDelete({ _id });
  }
}
