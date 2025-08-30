import React from 'react';
import { FaFileExport, FaFilePdf, FaLightbulb, FaRobot } from 'react-icons/fa';

type TabType = 'summary' | 'subtitles' | 'flashcards' | 'prompt';

interface ContentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'summary' as TabType, label: 'Summary', icon: FaFileExport },
    { id: 'subtitles' as TabType, label: 'Transcript', icon: FaFilePdf },
    { id: 'flashcards' as TabType, label: 'Flashcards', icon: FaLightbulb },
    { id: 'prompt' as TabType, label: 'Deep Dive', icon: FaRobot }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
            activeTab === id
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};
