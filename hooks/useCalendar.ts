import { useState, useMemo } from 'react';
import moment from 'jalali-moment';
import type { Day } from '../types';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState<any>(() => moment());

  const daysOfMonth = useMemo(() => {
    moment.locale('fa');
    const startOfMonth = currentDate.clone().startOf('jMonth');
    
    // jalali-moment week starts on Saturday (6) and ends on Friday (5)
    // We want our calendar to start on Saturday
    const startDate = startOfMonth.clone().startOf('week');
    
    const days: Day[] = [];
    let day = startDate.clone();
    
    // Create a 6-week (42-day) grid for consistent layout
    for(let i=0; i<42; i++) {
        days.push({
            date: day.clone(),
            isCurrentMonth: day.isSame(currentDate, 'jMonth'),
            isToday: day.isSame(moment(), 'jDay'),
        });
        day.add(1, 'day');
    }

    return days;
  }, [currentDate]);

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'jMonth'));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'jMonth'));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  const goToDate = (date: any) => {
    setCurrentDate(moment(date));
  };

  return {
    currentDate,
    daysOfMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    goToDate,
  };
};