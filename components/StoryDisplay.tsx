import React, { useState } from 'react';
import type { Story } from '../types';
import StoryModal from './StoryModal';

interface StoryDisplayProps {
  story: Story | null;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <div className="p-4">
        <h2 className="text-base font-bold text-gray-800 dark:text-white mb-2">قصه‌ی امروز</h2>
        {story ? (
          <div className="rounded-xl bg-white dark:bg-dark-bg-secondary shadow-sm overflow-hidden">
            {story.imageUrl && (
              <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <img src={story.imageUrl} alt={story.title} className="w-full h-32 object-cover" />
              </div>
            )}
            <div className="p-4">
               <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{story.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line line-clamp-3">
                {story.content}
              </p>
              <div className="text-left mt-2">
                <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-primary dark:text-blue-400 hover:underline focus:outline-none">
                  بیشتر بخوانید...
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 px-3 rounded-xl bg-white dark:bg-dark-bg-secondary shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">برای امروز قصه‌ای ثبت نشده است.</p>
          </div>
        )}
      </div>
      <StoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} story={story} />
    </>
  );
};

export default StoryDisplay;