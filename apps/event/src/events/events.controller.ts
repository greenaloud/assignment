import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserInfo } from '@app/common/types/user-info.type';
import { CurrentUser } from 'apps/auth/src/auth/current-user.decorator';
import { RequirePermissions } from '@app/common/common-auth/decorators/require-permissions.decorator';
import { PermissionType } from '@app/common/permissions/permissions';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @RequirePermissions(PermissionType.EVENT_WRITE)
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() { id: userId }: UserInfo,
  ) {
    return await this.eventsService.create(createEventDto, userId);
  }

  @Get()
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionType.EVENT_WRITE)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionType.EVENT_DELETE)
  async remove(@Param('id') id: string) {
    return await this.eventsService.remove(id);
  }
}
