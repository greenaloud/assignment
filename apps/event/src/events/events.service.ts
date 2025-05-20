import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepository: EventsRepository) {}

  create(createEventDto: CreateEventDto, userId: string) {
    return this.eventsRepository.create({
      ...createEventDto,
      userId,
    });
  }

  findAll() {
    return this.eventsRepository.find({});
  }

  findOne(id: string) {
    return this.eventsRepository.findOne({ _id: id });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventsRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateEventDto },
    );
  }

  remove(id: string) {
    return this.eventsRepository.deleteById(id);
  }
}
