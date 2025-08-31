import React from 'react';
import { Flashcard, Prompt } from '../services/types';
import { PromptDisplay } from './PromptDisplay';

type TabType = 'summary' | 'flashcards' | 'prompt';

interface ContentDisplayProps {
  activeTab: TabType;
  summary?: string;
  flashcards?: Flashcard[];
  prompt?: Prompt;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  activeTab,
  summary,
  flashcards,
  prompt
}) => {
  // console.log('ContentDisplay rendered with:', {
  //   activeTab,
  //   hasPrompt: !!prompt,
  //   promptContent: prompt
  // });

  const renderSummaryContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            {line.substring(3)}
          </h3>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="text-base font-medium text-gray-700 mt-3 mb-1">
            {line.substring(4)}
          </h4>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-gray-600 ml-4">
            {line.substring(2)}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<br key={index} />);
      } else {
        elements.push(
          <p key={index} className="text-gray-600 mb-2">
            {line}
          </p>
        );
      }
    });
    
    return elements;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        if (summary) {
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resumen Ejecutivo
                </h3>
              </div>
              <div className="p-6">
                <div className="prose prose-gray max-w-none">
                  {renderSummaryContent(summary)}
                </div>
              </div>
            </div>
          );
        }
        break;

      case 'flashcards':
        if (flashcards && flashcards.length > 0) {
          return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Tarjetas de Estudio
                  <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    {flashcards.length} tarjetas
                  </span>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {flashcards.map((card, index) => (
                    <div key={index} className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full mr-3">
                              Q{index + 1}
                            </span>
                            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Pregunta</span>
                          </div>
                          <p className="text-gray-800 font-medium leading-relaxed">{card.question}</p>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 text-xs font-semibold rounded-full mr-3">
                              A
                            </span>
                            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Respuesta</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{card.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        break;

      case 'prompt':
        if (prompt) {
          return <PromptDisplay prompt={prompt} />;
        }
        break;
    }

    return null;
  };

  return renderContent();
};
