
import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarEvent } from './event.interface';
import { CreateEventDto } from './dto/create-event.dto';
import { initialEventsData as initialEvents } from '../data/seed-data'; // Using initial data

@Injectable()
export class EventsService {
  private readonly events: CalendarEvent[] = [...initialEvents];

  create(createEventDto: CreateEventDto): CalendarEvent {
    const newEvent: CalendarEvent = {
      id: (this.events.length + 1).toString(), // Simple ID generation
      ...createEventDto,
    };
    this.events.push(newEvent);
    return newEvent;
  }

  findAll(): CalendarEvent[] {
    return this.events;
  }

  findOne(id: string): CalendarEvent | undefined {
    return this.events.find(event => event.id === id);
  }

  update(id: string, updateEventDto: Partial<CreateEventDto>): CalendarEvent {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    const updatedEvent = { ...this.events[eventIndex], ...updateEventDto };
    this.events[eventIndex] = updatedEvent;
    return updatedEvent;
  }

  remove(id: string): void {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    this.events.splice(eventIndex, 1);
  }
}