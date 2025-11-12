import React, { useMemo } from 'react';
import moment from 'jalali-moment';
import type { CalendarEvent } from '../types';

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onDeleteEvent: (eventId: string) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onDeleteEvent }) => {
  const upcomingEvents = useMemo(() => {
    const today = moment().startOf('day');
    return events
      .map(event => ({
        ...event,
        momentDate: moment(event.jalaliDate, 'jYYYY/jMM/DD'),
      }))
      .filter(event => event.momentDate.isSameOrAfter(today))
      .sort((a, b) => a.momentDate.diff(b.momentDate))
      .slice(0, 10);
  }, [events]);

  const getRelativeTimeText = (date: moment.Moment) => {
    const now = moment();
    const diffHours = date.diff(now, 'hours');
    const diffDays = date.startOf('day').diff(now.startOf('day'), 'days');

    if (diffDays === 0) {
      if (diffHours < 1) return 'به زودی';
      if (diffHours < 24) return `تا ${diffHours} ساعت دیگر`;
    }
    if (diffDays === 1) return 'فردا';
    return `تا ${diffDays} روز دیگر`;
  };

  return (
    <section className="bg-gray-100 dark:bg-dark-bg p-4">
      <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4">رویدادهای پیش رو</h2>
      <ul className="space-y-3">
        {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
          <li key={event.id || index} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-dark-bg-secondary shadow-sm">
            <div className="flex-grow">
              <p className={`font-semibold text-sm ${event.isHoliday ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>
                {event.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {event.momentDate.format('dddd، jD jMMMM')}
              </p>
            </div>
            <div className="text-center flex-shrink-0">
                <div className="text-xs font-bold text-primary-dark dark:text-blue-400">
                {getRelativeTimeText(event.momentDate)}
                </div>
                {event.id && ( // Show delete button only for personal events
                    <button onClick={() => onDeleteEvent(event.id!)} className="mt-1 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
          </li>
        )) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">رویداد پیش رویی وجود ندارد.</p>
          </div>
        )}
      </ul>
    </section>
  );
};

export default UpcomingEvents;