
import { EventCategory } from '../event.interface';

export class CreateEventDto {
  readonly title: string;
  readonly jalaliDate: string;
  readonly categories: EventCategory[];
  readonly isHoliday: boolean;
  readonly description?: string;
}