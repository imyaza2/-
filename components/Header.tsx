import React from 'react';

interface HeaderProps {
  currentDate: any; // jalali-moment object
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  onGoToToday: () => void;
  onOpenSearch: () => void;
  onAddEvent: () => void;
  onOpenMoreOptions: () => void;
}

const CalendarHeader: React.FC<HeaderProps> = ({ 
  currentDate, 
  onNextMonth, 
  onPreviousMonth, 
  onGoToToday,
  onOpenSearch,
  onAddEvent,
  onOpenMoreOptions
}) => {
  return (
    <header className="bg-white dark:bg-primary-dark p-4 text-gray-800 dark:text-white flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
         <button
          onClick={onOpenMoreOptions}
          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none"
          aria-label="گزینه‌های بیشتر"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        <h1 className="font-bold text-lg">تقویم ماه</h1>
        <div className="flex items-center gap-2">
            <button onClick={onOpenSearch} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none" aria-label="جستجو">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </button>
            <button onClick={onAddEvent} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none" aria-label="افزودن رویداد">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
      
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