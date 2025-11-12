
import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CalendarEvent } from './event.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto): CalendarEvent {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(): CalendarEvent[] {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): CalendarEvent {
    const event = this.eventsService.findOne(id);
    if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: Partial<CreateEventDto>): CalendarEvent {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    this.eventsService.remove(id);
    return { message: `Event with ID ${id} deleted successfully.` };
  }
}