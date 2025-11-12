import React, { useState, useCallback, useEffect } from 'react';
import type { CalendarEvent, EventCategory } from '../types';
import moment from 'jalali-moment';
import { categories as allCategories } from '../data/categories';

const EventFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id'>, id?: string) => Promise<void>;
    eventToEdit: CalendarEvent | null;
}> = ({ isOpen, onClose, onSave, eventToEdit }) => {
    const [title, setTitle] = useState('');
    const [jalaliDate, setJalaliDate] = useState('');
    const [categories, setCategories] = useState<Set<EventCategory>>(new Set());
    const [isHoliday, setIsHoliday] = useState(false);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setJalaliDate(eventToEdit.jalaliDate);
            setCategories(new Set(eventToEdit.categories));
            setIsHoliday(eventToEdit.isHoliday);
        } else {
            setTitle('');
            setJalaliDate('');
            setCategories(new Set());
            setIsHoliday(false);
        }
        setError('');
    }, [eventToEdit, isOpen]);

    const handleCategoryChange = (category: EventCategory) => {
        setCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };
    
    const handleSubmit = async () => {
        if (!title.trim() || !jalaliDate.trim()) {
            setError('عنوان و تاریخ نمی‌توانند خالی باشند.');
            return;
        }
        if (!moment(jalaliDate, 'jYYYY/jMM/DD', true).isValid()) {
            setError('فرمت تاریخ شمسی صحیح نیست. (مثال: 1403/01/01)');
            return;
        }
        
        setIsSaving(true);
        setError('');

        try {
            await onSave({
                title,
                jalaliDate,
                categories: Array.from(categories),
                isHoliday,
            }, eventToEdit?.id);
            onClose();
        } catch (err) {
            setError('خطا در ذخیره‌سازی. لطفا دوباره تلاش کنید.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-5 border-b">
                    <h3 className="text-lg font-semibold">{eventToEdit ? 'ویرایش مناسبت' : 'افزودن مناسبت جدید'}</h3>
                </div>
                <div className="p-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">عنوان</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">تاریخ شمسی (YYYY/MM/DD)</label>
                        <input type="text" value={jalaliDate} onChange={e => setJalaliDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="1403/01/22" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">دسته‌بندی‌ها</label>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {allCategories.filter(c => c.name !== 'شخصی').map(cat => (
                                <label key={cat.name} className="flex items-center space-x-2 space-x-reverse">
                                    <input type="checkbox" checked={categories.has(cat.name)} onChange={() => handleCategoryChange(cat.name)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                    <span>{cat.name}</span>
                                 </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input id="isHoliday" type="checkbox" checked={isHoliday} onChange={e => setIsHoliday(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <label htmlFor="isHoliday" className="mr-2 block text-sm text-gray-900">تعطیل رسمی است</label>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50">انصراف</button>
                    <button onClick={handleSubmit} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover disabled:opacity-50">
                        {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventManagement: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
    
    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await fetch('/events');
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                const data: CalendarEvent[] = await response.json();
                const sortedData = data.sort((a, b) => moment(a.jalaliDate, 'jYYYY/jMM/jDD').diff(moment(b.jalaliDate, 'jYYYY/jMM/jDD')));
                setEvents(sortedData);
                setIsLoading(false);
                return; // Success
            } catch (err) {
                console.error(`Fetch attempt ${attempt} failed:`, err);
                if (attempt === 3) {
                    setError('ارتباط با سرور برقرار نشد. لطفاً از اجرای صحیح سرور اطمینان حاصل کرده و صفحه را رفرش کنید.');
                    setIsLoading(false);
                } else {
                    await new Promise(res => setTimeout(res, 1500)); // Wait before next attempt
                }
            }
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleAdd = () => {
        setEventToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (event: CalendarEvent) => {
        setEventToEdit(event);
        setIsModalOpen(true);
    };

    const handleDelete = useCallback(async (eventId: string) => {
        if(window.confirm('آیا از حذف این مناسبت اطمینان دارید؟')) {
             try {
                const response = await fetch(`/events/${eventId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete');
                }
                setEvents(prev => prev.filter(e => e.id !== eventId));
            } catch (err) {
                alert('خطا در حذف مناسبت.');
                console.error(err);
            }
        }
    }, []);

    const handleSave = useCallback(async (eventData: Omit<CalendarEvent, 'id'>, id?: string) => {
        const isEditing = !!id;
        const url = isEditing ? `/events/${id}` : '/events';
        const method = isEditing ? 'PATCH' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            throw new Error('Failed to save event');
        }
        
        // Refresh list after saving
        await fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="bg-white shadow-xl rounded-lg">
            <div className="p-4 sm:p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">مدیریت مناسبت‌ها</h2>
                <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover">
                    + افزودن مناسبت
                </button>
            </div>
            <div className="overflow-x-auto">
                {isLoading && <p className="p-6 text-center">در حال بارگذاری...</p>}
                {error && <p className="p-6 text-center text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دسته‌بندی‌ها</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">تعطیل</th>
                                <th className="relative px-6 py-3"><span className="sr-only">عملیات</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map(event => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.jalaliDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-wrap gap-1">
                                            {event.categories.map(cat => <span key={cat} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{cat}</span>)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        {event.isHoliday ? 
                                            <span className="text-red-500">&#10003;</span> : 
                                            <span className="text-gray-400">&ndash;</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                                        <button onClick={() => handleEdit(event)} className="text-primary hover:text-primary-dark">ویرایش</button>
                                        <button onClick={() => handleDelete(event.id!)} className="text-red-600 hover:text-red-800">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <EventFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} eventToEdit={eventToEdit} />
        </div>
    );
};

export default EventManagement;