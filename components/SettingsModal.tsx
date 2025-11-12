import React from 'react';
import type { EventCategory } from '../types';
import { categories } from '../data/categories';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: Set<EventCategory>;
  onCategoryToggle: (category: EventCategory) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, selectedCategories, onCategoryToggle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تنظیمات و فیلترها</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                     <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">نمایش مناسبت‌ها</h4>
                    <div className="space-y-4">
                        {categories.map((category) => (
                        <label key={category.name} className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <span className={`w-3 h-3 rounded-full ${category.toggleColor}`}></span>
                                {category.name}
                            </div>
                            <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={selectedCategories.has(category.name)}
                                onChange={() => onCategoryToggle(category.name)}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </div>
                        </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;