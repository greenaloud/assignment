import { BaseRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Event, EventDocument } from './models/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventsRepository extends BaseRepository<Event, EventDocument> {
  constructor(@InjectModel(Event.name) eventModel: Model<Event>) {
    super(eventModel);
  }
}
