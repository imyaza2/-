import React from 'react';

interface HeaderProps {
  currentDate: any; // jalali-moment object
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  onGoToToday: () => void;
}

const CalendarHeader: React.FC<HeaderProps> = ({ 
  currentDate, 
  onNextMonth, 
  onPreviousMonth, 
  onGoToToday
}) => {
  return (
    <header className="bg-white dark:bg-primary-dark p-4 text-gray-800 dark:text-white flex-shrink-0">
      <div className="bg-gray-100 dark:bg-black/20 p-1 rounded-full flex justify-between text-sm font-semibold mb-6">
        <button className="py-2 w-full text-gray-500 dark:text-gray-300 rounded-full">روز</button>
        <button className="py-2 w-full text-gray-500 dark:text-gray-300 rounded-full">هفته</button>
        <button className="py-2 w-full bg-white dark:bg-primary-dark text-primary-dark dark:text-white rounded-full shadow">ماه</button>
        <button className="py-2 w-full text-gray-500 dark:text-gray-300 rounded-full">سال</button>
      </div>

      <div className="flex items-center justify-between text-center">
        <button onClick={onPreviousMonth} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        <div onClick={onGoToToday} className="cursor-pointer">
            <h2 className="text-2xl font-bold">{currentDate.format('jMMMM')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{currentDate.format('jYYYY')}</p>
        </div>
        <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;