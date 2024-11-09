import React from 'react';

interface FlashcardProps {
  front: string;
  back: string;
}

export const Flashcard: React.FC<FlashcardProps> = ({ front, back }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-2xl p-4 sm:p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-500">Question</h3>
        <p className="text-xl text-gray-800 font-medium">{front}</p>
      </div>
      <div className="h-px bg-gray-200" />
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-500">Answer</h3>
        <p className="text-lg text-gray-700">{back}</p>
      </div>
    </div>
  );
};