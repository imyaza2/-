import React from 'react';
import type { Day, CalendarEvent, Story } from '../types';

interface CalendarGridProps {
  days: Day[];
  events: CalendarEvent[];
  stories: Story[];
  onDayClick: (date: any) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ days, events, stories, onDayClick }) => {
  const weekdays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const getEventsForDay = (day: Day) => {
    const jalaliDateStr = day.date.format('jYYYY/jMM/jDD');
    return events.filter(e => e.jalaliDate === jalaliDateStr);
  };
  
  const getStoryForDay = (day: Day) => {
    const jalaliDateStr = day.date.format('jYYYY/jMM/jDD');
    return stories.find(s => s.jalaliDate === jalaliDateStr);
  };

  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-b-lg pt-4 pb-2">
      <div className="grid grid-cols-7 pb-2">
        {weekdays.map(day => (
          <div key={day} className="py-1 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const dayStory = getStoryForDay(day);
          const isHoliday = dayEvents.some(e => e.isHoliday);
          const hasContent = dayEvents.length > 0 || !!dayStory;
          
          let dayClasses = 'flex flex-col items-center justify-center h-12 rounded-full transition-colors duration-200 ease-in-out';
          if (hasContent) {
            dayClasses += ' cursor-pointer hover:bg-blue-100 dark:hover:bg-white/10';
          }

          let dateClasses = 'w-8 h-8 flex items-center justify-center rounded-full';
          
          if(day.isToday) {
             dateClasses += ' bg-primary-dark text-white font-bold';
          } else if(isHoliday && day.isCurrentMonth) {
              dateClasses += ' text-red-500';
          } else if (!day.isCurrentMonth) {
              dateClasses += ' text-gray-300 dark:text-gray-600';
          } else {
              dateClasses += ' text-gray-700 dark:text-gray-200';
          }
          
          return (
            <div key={index} className={dayClasses} onClick={() => hasContent && onDayClick(day.date)}>
              <span className={dateClasses}>
                  {day.date.format('jD')}
              </span>
              {hasContent && day.isCurrentMonth && <div className="w-1 h-1 bg-primary-dark dark:bg-blue-400 rounded-full mt-1"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;