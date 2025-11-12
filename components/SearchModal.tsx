import React, { useState, useMemo } from 'react';
// FIX: Use renamed CalendarEvent type.
import type { CalendarEvent } from '../types';
import moment from 'jalali-moment';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Use renamed CalendarEvent type.
  events: CalendarEvent[];
  onGoToDate: (date: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, events, onGoToDate }) => {
    const [query, setQuery] = useState('');

    const searchResults = useMemo(() => {
        if (!query.trim()) {
            return [];
        }
        return events
            .filter(event => event.title.toLowerCase().includes(query.toLowerCase()))
            .sort((a, b) => moment(a.jalaliDate, 'jYYYY/jMM/DD').diff(moment(b.jalaliDate, 'jYYYY/jMM/jDD')));
    }, [query, events]);

    // FIX: Use renamed CalendarEvent type.
    const handleResultClick = (event: CalendarEvent) => {
        const eventDate = moment(event.jalaliDate, 'jYYYY/jMM/jDD');
        onGoToDate(eventDate);
        onClose();
        setQuery('');
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-16 sm:pt-24 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <input
                        type="text"
                        placeholder="جستجوی مناسبت..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                    />
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {query.trim() && searchResults.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">موردی یافت نشد.</p>
                    )}
                    {searchResults.length > 0 && (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                           {searchResults.map((event, index) => (
                               <li key={event.id || index} onClick={() => handleResultClick(event)} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg">
                                   <p className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</p>
                                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{moment(event.jalaliDate, 'jYYYY/jMM/jDD').format('dddd، jD jMMMM jYYYY')}</p>
                               </li>
                           ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;