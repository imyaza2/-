import React, { useState, useCallback } from 'react';
import moment from 'jalali-moment';

interface DateConverterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DateInputGroup: React.FC<{
    label: string;
    date: moment.Moment;
    onDateChange: (newDate: moment.Moment) => void;
    formatters: { year: string; month: string; day: string };
    calendarType: 'j' | 'g' | 'i';
}> = ({ label, date, onDateChange, formatters, calendarType }) => {

    const handleInputChange = (part: 'year' | 'month' | 'day', value: string) => {
        const year = part === 'year' ? value : date.format(formatters.year);
        const month = part === 'month' ? value : date.format(formatters.month);
        const day = part === 'day' ? value : date.format(formatters.day);

        const format = `${formatters.year}/${formatters.month}/${formatters.day}`;
        const newDate = moment(`${year}/${month}/${day}`, format);

        if (newDate.isValid()) {
            onDateChange(newDate);
        }
    };
    
    const year = date.format(formatters.year);
    const month = date.format(formatters.month);
    const day = date.format(formatters.day);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="grid grid-cols-3 gap-2">
                <input
                    type="number"
                    value={year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="سال"
                    className="w-full px-3 py-2 text-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="number"
                    value={month}
                    onChange={(e) => handleInputChange('month', e.target.value)}
                    placeholder="ماه"
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 text-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                    type="number"
                    value={day}
                    onChange={(e) => handleInputChange('day', e.target.value)}
                    placeholder="روز"
                    min="1"
                    max="31"
                    className="w-full px-3 py-2 text-center bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
             <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                {date.format(calendarType === 'j' ? 'dddd jD jMMMM jYYYY' : (calendarType === 'g' ? 'dddd, MMMM D, YYYY' : 'dddd iD iMMMM iYYYY'))}
            </p>
        </div>
    );
};

const DateConverterModal: React.FC<DateConverterModalProps> = ({ isOpen, onClose }) => {
    const [date, setDate] = useState(() => moment());

    const handleDateChange = useCallback((newDate: moment.Moment) => {
        setDate(newDate);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">مبدل تاریخ</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <DateInputGroup
                        label="شمسی (جلالی)"
                        date={date}
                        onDateChange={handleDateChange}
                        formatters={{ year: 'jYYYY', month: 'jMM', day: 'jDD' }}
                        calendarType="j"
                    />
                    <DateInputGroup
                        label="میلادی"
                        date={date}
                        onDateChange={handleDateChange}
                        formatters={{ year: 'YYYY', month: 'MM', day: 'DD' }}
                        calendarType="g"
                    />
                    <DateInputGroup
                        label="قمری"
                        date={date}
                        onDateChange={handleDateChange}
                        formatters={{ year: 'iYYYY', month: 'iMM', day: 'iDD' }}
                        calendarType="i"
                    />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                    <button 
                        onClick={() => setDate(moment())}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                    >
                        بازگشت به امروز
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateConverterModal;