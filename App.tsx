import React, { useState, useMemo, useCallback, useEffect } from 'react';
import moment from 'jalali-moment';
import CalendarHeader from './components/Header';
import CalendarGrid from './components/CalendarGrid';
import SettingsModal from './components/SettingsModal';
import EventModal from './components/EventModal';
import DateConverterModal from './components/DateConverterModal';
import PrayerTimesModal from './components/PrayerTimesModal';
import SearchModal from './components/SearchModal';
import UpcomingEvents from './components/UpcomingEvents';
import MoreOptionsPanel from './components/MoreOptionsPanel';
import StoryDisplay from './components/StoryDisplay';
import { useCalendar } from './hooks/useCalendar';
import { storiesData } from './data/stories';
import { categories } from './data/categories';
import { eventsData } from './data/events';
import type { EventCategory, CalendarEvent, Story } from './types';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { currentDate, daysOfMonth, goToNextMonth, goToPreviousMonth, goToToday, goToDate } = useCalendar();
  
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(
    new Set(categories.map(c => c.name))
  );

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDateConverterOpen, setIsDateConverterOpen] = useState(false);
  const [isPrayerTimesModalOpen, setIsPrayerTimesModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [activeDateForStory, setActiveDateForStory] = useState(() => moment());
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
    } catch (error) {
      console.error('Failed to access theme from localStorage', error);
    }
    // Check for system preference if no theme is stored
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const [officialEvents] = useState<CalendarEvent[]>(eventsData);
  
  const [personalEvents, setPersonalEvents] = useState<CalendarEvent[]>(() => {
    try {
      const items = window.localStorage.getItem('personalEvents');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Failed to load personal events:", error);
      return [];
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
        e.preventDefault();
        setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
        return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
    });
  };

  useEffect(() => {
    try {
      window.localStorage.setItem('personalEvents', JSON.stringify(personalEvents));
    } catch (error) {
      console.error("Failed to save personal events:", error);
    }
  }, [personalEvents]);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error('Failed to save theme to localStorage', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PWA & Service Worker Notification logic
  useEffect(() => {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            const notifications = personalEvents
                .filter(event => event.reminderOffset !== undefined)
                .map(event => {
                    const eventDate = moment(event.jalaliDate, 'jYYYY/jMM/DD');
                    const timestamp = eventDate.clone().subtract(event.reminderOffset!, 'minutes').valueOf();
                    return {
                        title: event.title,
                        timestamp: timestamp,
                    };
                })
                .filter(n => n.timestamp > Date.now());

            registration.active?.postMessage({
                type: 'SCHEDULE_NOTIFICATIONS',
                payload: notifications,
            });
        });
    }
  }, [personalEvents]);


  const addPersonalEvent = useCallback((event: Omit<CalendarEvent, 'id' | 'categories' | 'isHoliday'>) => {
    if ('Notification' in window && Notification.permission === 'default' && event.reminderOffset) {
       Notification.requestPermission();
    }
    const newEvent: CalendarEvent = { 
      ...event, 
      id: Date.now().toString(), 
      categories: ['شخصی'], 
      isHoliday: false 
    };
    setPersonalEvents(prev => [...prev, newEvent]);
  }, []);

  const deletePersonalEvent = useCallback((eventId: string) => {
    setPersonalEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const openAddEventModal = () => {
    const today = moment();
    setSelectedDate(today);
    setActiveDateForStory(today.clone());
    const jalaliDateStr = today.format('jYYYY/jMM/jDD');
    const relevantEvents = allEvents.filter(event => event.jalaliDate === jalaliDateStr);
    setSelectedDayEvents(relevantEvents);
    setIsEventModalOpen(true);
  }


  const handleCategoryToggle = useCallback((category: EventCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const filteredOfficialEvents = useMemo(() => {
    return officialEvents.filter(event => 
      event.categories.some(cat => selectedCategories.has(cat))
    );
  }, [selectedCategories, officialEvents]);

  const allEvents = useMemo(() => {
    const filteredPersonalEvents = selectedCategories.has('شخصی') ? personalEvents : [];
    return [...filteredOfficialEvents, ...filteredPersonalEvents];
  }, [filteredOfficialEvents, personalEvents, selectedCategories]);

  const activeStory = useMemo(() => {
    const jalaliDateStr = activeDateForStory.format('jYYYY/jMM/jDD');
    return storiesData.find(s => s.jalaliDate === jalaliDateStr) || null;
  }, [activeDateForStory]);


  const handleDayClick = useCallback((date: any) => {
    const jalaliDateStr = date.format('jYYYY/jMM/jDD');
    const relevantEvents = allEvents.filter(event => event.jalaliDate === jalaliDateStr);
    
    setSelectedDate(date);
    setActiveDateForStory(date.clone());
    setSelectedDayEvents(relevantEvents);
    setIsEventModalOpen(true);
  }, [allEvents]);

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedDate(null);
    setSelectedDayEvents([]);
  };
  
  const handleGoToDate = useCallback((date: any) => {
    goToDate(date);
    handleDayClick(date);
  }, [goToDate, handleDayClick]);


  return (
    <div className="font-[Vazirmatn,sans-serif] flex justify-center py-4 sm:py-8">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-dark-bg shadow-2xl rounded-3xl overflow-hidden min-h-[90vh] flex flex-col">
        <CalendarHeader
            currentDate={currentDate}
            onNextMonth={goToNextMonth}
            onPreviousMonth={goToPreviousMonth}
            onGoToToday={goToToday}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onAddEvent={openAddEventModal}
            onOpenMoreOptions={() => setIsMoreOptionsOpen(true)}
        />
        
        <div className="flex-grow overflow-y-auto bg-gray-100 dark:bg-dark-bg">
            <StoryDisplay story={activeStory} />
            
            <main className="bg-white dark:bg-dark-bg-secondary px-2">
                <CalendarGrid
                    days={daysOfMonth}
                    events={allEvents}
                    stories={storiesData}
                    onDayClick={handleDayClick}
                />
            </main>
            
            <UpcomingEvents 
              events={allEvents} 
              onDeleteEvent={deletePersonalEvent} 
            />
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={closeEventModal}
        date={selectedDate}
        events={selectedDayEvents}
        onAddEvent={addPersonalEvent}
        onDeleteEvent={deletePersonalEvent}
      />
      <MoreOptionsPanel
        isOpen={isMoreOptionsOpen}
        onClose={() => setIsMoreOptionsOpen(false)}
        onOpenSettings={() => { setIsMoreOptionsOpen(false); setIsSettingsModalOpen(true); }}
        onOpenDateConverter={() => { setIsMoreOptionsOpen(false); setIsDateConverterOpen(true); }}
        onOpenPrayerTimes={() => { setIsMoreOptionsOpen(false); setIsPrayerTimesModalOpen(true); }}
        onToggleTheme={toggleTheme}
        theme={theme}
        onInstall={handleInstallClick}
        showInstallButton={!!installPrompt}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
      />
      <DateConverterModal
        isOpen={isDateConverterOpen}
        onClose={() => setIsDateConverterOpen(false)}
      />
      <PrayerTimesModal
        isOpen={isPrayerTimesModalOpen}
        onClose={() => setIsPrayerTimesModalOpen(false)}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        events={[...officialEvents, ...personalEvents]}
        onGoToDate={handleGoToDate}
      />
    </div>
  );
};

export default App;