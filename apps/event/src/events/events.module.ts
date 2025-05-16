import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { DatabaseModule } from '@app/common';
import { EventsRepository } from './events.repository';
import { EventDocument, EventSchema } from './models/event.schema';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: EventDocument.name, schema: EventSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
})
export class EventsModule {}
