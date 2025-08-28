import React from 'react';
import { Flashcard } from '../services/types';

type TabType = 'summary' | 'subtitles' | 'flashcards';

interface ContentDisplayProps {
  activeTab: TabType;
  summary: string;
  subtitles: string;
  flashcards: Flashcard[];
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  activeTab,
  summary,
  subtitles,
  flashcards
}) => {
  if (activeTab === 'summary' && summary) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Summary
        </h3>
        <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
      </div>
    );
  }

  if (activeTab === 'subtitles' && subtitles) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Full Transcript
        </h3>
        <p className="text-gray-700 whitespace-pre-wrap text-sm">{subtitles}</p>
      </div>
    );
  }

  if (activeTab === 'flashcards' && flashcards.length > 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">
          Flashcards ({flashcards.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {flashcards.map((card, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="mb-2">
                <span className="text-sm font-medium text-blue-600">Q{index + 1}:</span>
                <p className="text-gray-700 font-medium">{card.question}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-green-600">A:</span>
                <p className="text-gray-700">{card.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
