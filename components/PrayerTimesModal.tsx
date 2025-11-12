import React, { useState, useMemo } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import moment from 'jalali-moment';

interface PrayerTimesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const cities = [
    { name: 'تهران', latitude: 35.6892, longitude: 51.3890 },
    { name: 'مشهد', latitude: 36.2605, longitude: 59.6168 },
    { name: 'اصفهان', latitude: 32.6539, longitude: 51.6660 },
    { name: 'تبریز', latitude: 38.0772, longitude: 46.2821 },
];

const PrayerTimesModal: React.FC<PrayerTimesModalProps> = ({ isOpen, onClose }) => {
    const [selectedCity, setSelectedCity] = useState(cities[0]);

    const prayerTimes = useMemo(() => {
        const coordinates = new Coordinates(selectedCity.latitude, selectedCity.longitude);
        const params = CalculationMethod.Tehran();
        const date = new Date();
        try {
            return new PrayerTimes(coordinates, date, params);
        } catch (e) {
            console.error("Error calculating prayer times:", e);
            return null;
        }
    }, [selectedCity]);

    const formatTime = (date: Date | null | undefined) => {
        if (!date) return '--:--';
        return moment(date).locale('fa').format('HH:mm');
    }

    const prayerList = useMemo(() => {
      if (!prayerTimes) return [];
      return [
        { name: 'فجر', time: formatTime(prayerTimes.fajr) },
        { name: 'طلوع', time: formatTime(prayerTimes.sunrise) },
        { name: 'ظهر', time: formatTime(prayerTimes.dhuhr) },
        { name: 'عصر', time: formatTime(prayerTimes.asr) },
        { name: 'مغرب', time: formatTime(prayerTimes.maghrib) },
        { name: 'عشاء', time: formatTime(prayerTimes.isha) },
      ];
    }, [prayerTimes]);

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const city = cities.find(c => c.name === event.target.value);
        if (city) {
            setSelectedCity(city);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">اوقات شرعی</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">انتخاب شهر:</label>
                        <select
                            id="city-select"
                            value={selectedCity.name}
                            onChange={handleCityChange}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            {cities.map(city => (
                                <option key={city.name} value={city.name}>{city.name}</option>
                            ))}
                        </select>
                    </div>

                    {prayerTimes ? (
                         <ul className="space-y-3">
                            {prayerList.map(prayer => (
                                <li key={prayer.name} className="flex justify-between items-center text-gray-800 dark:text-gray-200 text-lg border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                                    <span className="font-medium">{prayer.name}</span>
                                    <span className="font-bold tracking-wider">{prayer.time}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-red-500">خطا در محاسبه اوقات شرعی.</p>
                    )}
                </div>
                 <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                    محاسبه بر اساس روش مؤسسه ژئوفیزیک دانشگاه تهران
                </div>
            </div>
        </div>
    );
};

export default PrayerTimesModal;