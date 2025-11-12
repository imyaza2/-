import type { EventCategory } from '../types';

export interface CategoryStyle {
    name: EventCategory;
    toggleColor: string;
    modalStyles: string;
}

export const categories: CategoryStyle[] = [
    { 
        name: 'تعطیل رسمی',
        toggleColor: 'bg-red-500',
        modalStyles: 'border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-700'
    },
    {
        name: 'ملی',
        toggleColor: 'bg-blue-500',
        modalStyles: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700'
    },
    {
        name: 'مذهبی',
        toggleColor: 'bg-green-500',
        modalStyles: 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-700'
    },
    {
        name: 'جهانی',
        toggleColor: 'bg-yellow-500',
        modalStyles: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-700'
    },
    {
        name: 'شخصی',
        toggleColor: 'bg-purple-500',
        modalStyles: 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-700'
    },
];