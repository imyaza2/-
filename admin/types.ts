export type EventCategory = string;

// FIX: Renamed Event to CalendarEvent to avoid name collision with the global Event type.
export interface CalendarEvent {
  id?: string; // Unique identifier for personal events
  jalaliDate: string; // YYYY/MM/DD
  title: string;
  description?: string;
  categories: EventCategory[];
  isHoliday: boolean;
  reminderOffset?: number; // Reminder offset in minutes before the event
}

export interface Day {
  date: any; // A jalali-moment object
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface Story {
  jalaliDate: string; // YYYY/MM/DD
  title: string;
  content: string;
  imageUrl?: string;
}