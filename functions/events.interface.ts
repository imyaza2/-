
export type EventCategory = string;

export interface CalendarEvent {
  id?: string;
  jalaliDate: string;
  title: string;
  description?: string;
  categories: EventCategory[];
  isHoliday: boolean;
  reminderOffset?: number;
}