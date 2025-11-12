import React, { useState } from 'react';
import type { CalendarEvent } from '../types';
import { categories } from '../data/categories';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: any; // jalali-moment object
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'categories' | 'isHoliday'>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const categoryStyleMap = new Map(categories.map(c => [c.name, c.modalStyles]));

const reminderOptions = [
  { label: 'بدون یادآوری', value: 'none' },
  { label: '۱۵ دقیقه قبل', value: 15 },
  { label: '۱ ساعت قبل', value: 60 },
  { label: '۱ روز قبل', value: 1440 },
];


const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, date, events, onAddEvent, onDeleteEvent }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newReminderOffset, setNewReminderOffset] = useState<string>('none');

  if (!isOpen) return null;
  
  const officialEvents = events.filter(e => !e.id);
  const personalEvents = events.filter(e => !!e.id);
  const hasContent = officialEvents.length > 0 || personalEvents.length > 0;

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle.trim()) {
      onAddEvent({
        jalaliDate: date.format('jYYYY/jMM/DD'),
        title: newEventTitle,
        description: newEventDesc,
        reminderOffset: newReminderOffset === 'none' ? undefined : Number(newReminderOffset),
      });
      setNewEventTitle('');
      setNewEventDesc('');
      setNewReminderOffset('none');
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{date.format('dddd، jD jMMMM jYYYY')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{date.format('D MMMM YYYY')}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {hasContent ? (
            <div className="space-y-6">
              {officialEvents.length > 0 && (
                <div className="space-y-4">
                   <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">مناسبت‌ها</h4>
                  {officialEvents.map((event, index) => (
                    <div key={index} className={`p-4 border-r-4 rounded-md ${categoryStyleMap.get(event.categories.find(c => categoryStyleMap.has(c))!) || 'border-gray-500'}`}>
                      <h5 className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</h5>
                      {event.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.categories.map(cat => (
                             <span key={cat} className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">{cat}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {officialEvents.length > 0 && personalEvents.length > 0 && <hr className="border-gray-200 dark:border-gray-600" />}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">رویدادهای شخصی</h4>
                  <button onClick={() => setIsAdding(!isAdding)} className="text-sm font-medium text-primary-dark hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    {isAdding ? 'انصراف' : '+ افزودن'}
                  </button>
                </div>
                {isAdding && (
                  <form onSubmit={handleAddEvent} className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg space-y-3">
                    <input
                      type="text"
                      placeholder="عنوان رویداد"
                      value={newEventTitle}
                      onChange={e => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-dark focus:border-primary-dark"
                      autoFocus
                    />
                    <textarea
                      placeholder="توضیحات (اختیاری)"
                      value={newEventDesc}
                      onChange={e => setNewEventDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-dark focus:border-primary-dark"
                    />
                     <select
                        value={newReminderOffset}
                        onChange={e => setNewReminderOffset(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-dark focus:border-primary-dark"
                    >
                        {reminderOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="w-full px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      ذخیره
                    </button>
                  </form>
                )}
                {personalEvents.length > 0 ? (
                  personalEvents.map((event, index) => (
                    <div key={index} className={`relative group p-4 border-r-4 rounded-md ${categoryStyleMap.get('شخصی') || 'border-gray-500'}`}>
                      <h5 className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</h5>
                      {event.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{event.description}</p>}
                       {event.reminderOffset && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>{reminderOptions.find(o => o.value === event.reminderOffset)?.label}</span>
                        </div>
                      )}
                      <button onClick={() => onDeleteEvent(event.id!)} className="absolute top-2 left-2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  !isAdding && <p className="text-sm text-gray-500 dark:text-gray-400">رویداد شخصی برای این روز ثبت نشده است.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
                 <p className="text-gray-500 dark:text-gray-400 mb-4">رویدادی برای این روز ثبت نشده است.</p>
                 <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    افزودن رویداد شخصی
                 </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;