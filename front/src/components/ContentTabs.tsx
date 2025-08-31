import React from 'react';
import { FaRegFileAlt, FaLayerGroup, FaBrain } from 'react-icons/fa';

type TabType = 'summary' | 'flashcards' | 'prompt';

interface ContentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'summary' as TabType,
      label: 'Summary',
      shortLabel: 'Summary',
      icon: <FaRegFileAlt className="w-4 h-4" />
    },
    {
      id: 'flashcards' as TabType,
      label: 'Flashcards',
      shortLabel: 'Cards',
      icon: <FaLayerGroup className="w-4 h-4" />
    },
    {
      id: 'prompt' as TabType,
      label: 'Deep Dive',
      shortLabel: 'Deep',
      icon: <FaBrain className="w-4 h-4" />
    }
  ];

  return (
    <div className="grid grid-cols-3 sm:flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-2 sm:px-4 py-3 sm:py-2 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-indigo-500 text-indigo-600 bg-indigo-50 sm:bg-transparent rounded-lg sm:rounded-none'
              : 'border-transparent text-gray-500 hover:text-gray-700 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none'
          }`}
        >
          {tab.icon}
          <span className="sm:hidden">{tab.shortLabel}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
