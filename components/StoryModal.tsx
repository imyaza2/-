import React from 'react';
import type { Story } from '../types';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story | null;
}

const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose, story }) => {
  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="relative flex-shrink-0">
          {story.imageUrl && (
            <img src={story.imageUrl} alt={story.title} className="w-full h-48 object-cover rounded-t-lg" />
          )}
          <button onClick={onClose} className="absolute top-3 right-3 text-white bg-black/50 hover:bg-black/70 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{story.title}</h2>
          <article className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            <p>{story.content}</p>
          </article>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
