import React from 'react';

interface MoreOptionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenDateConverter: () => void;
  onOpenPrayerTimes: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  onInstall: () => void;
  showInstallButton: boolean;
}

const MoreOptionsPanel: React.FC<MoreOptionsPanelProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenDateConverter,
  onOpenPrayerTimes,
  onToggleTheme,
  theme,
  onInstall,
  showInstallButton,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end" onClick={onClose}>
      <div
        className="bg-white dark:bg-dark-bg-secondary rounded-t-2xl shadow-xl w-full max-w-sm mx-auto p-4 transition-transform transform-gpu"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out forwards' }}
      >
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
        <nav>
          <ul className="space-y-2">
            <OptionItem icon={FilterIcon} label="فیلتر مناسبت‌ها" onClick={onOpenSettings} />
            <OptionItem icon={DateConvertIcon} label="مبدل تاریخ" onClick={onOpenDateConverter} />
            <OptionItem icon={PrayerTimeIcon} label="اوقات شرعی" onClick={onOpenPrayerTimes} />
            <OptionItem
              icon={theme === 'dark' ? SunIcon : MoonIcon}
              label={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
              onClick={onToggleTheme}
            />
            {showInstallButton && <OptionItem icon={InstallIcon} label="نصب برنامه" onClick={onInstall} />}
          </ul>
        </nav>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const OptionItem: React.FC<{ icon: React.ElementType; label: string; onClick: () => void }> = ({
  icon: Icon,
  label,
  onClick,
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 p-3 text-right text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
      >
        <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
};

// SVG Icons
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);
const DateConvertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);
const PrayerTimeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a.75.75 0 01.75.75v.51a4.51 4.51 0 014.238 4.238H15.5a.75.75 0 010 1.5h-.51a4.51 4.51 0 01-4.238 4.238v.51a.75.75 0 01-1.5 0v-.51a4.51 4.51 0 01-4.238-4.238H4.5a.75.75 0 010-1.5h.51A4.51 4.51 0 019.25 4.26V3.75A.75.75 0 0110 2zM8.75 7.75a1.25 1.25 0 102.5 0 1.25 1.25 0 00-2.5 0zM10 12.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
  </svg>
);
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
  </svg>
);
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);
const InstallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm10 5a1 1 0 10-2 0v2a1 1 0 102 0V8zM8 8a1 1 0 11-2 0 1 1 0 012 0zm2 5a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
);

export default MoreOptionsPanel;