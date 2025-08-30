import React from 'react';
import { FaRobot } from 'react-icons/fa';
import { SiOpenai, SiGooglegemini } from 'react-icons/si';

interface PromptDisplayProps {
  prompt: {
    mainPrompt: string;
    suggestedQuestions: string[];
    context: {
      summary: string;
      keyPoints: string[];
      relevantTopics: string[];
    };
  };
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  const llmLinks = [
    {
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      icon: SiOpenai,
      color: 'bg-green-500'
    },
    {
      name: 'Claude',
      url: 'https://claude.ai',
      icon: FaRobot,
      color: 'bg-purple-500'
    },
    {
      name: 'Gemini',
      url: 'https://gemini.google.com',
      icon: SiGooglegemini,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Deep Dive Prompt
        </h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap mb-4">{prompt.mainPrompt}</p>
          
          {prompt.suggestedQuestions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Suggested Questions:</h4>
              <ul className="list-disc pl-5 space-y-2">
                {prompt.suggestedQuestions.map((question, index) => (
                  <li key={index} className="text-gray-600">{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
        {llmLinks.map((llm) => (
          <a
            key={llm.name}
            href={llm.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center px-6 py-3 rounded-lg ${llm.color} text-white transition-transform hover:scale-105 shadow-md`}
          >
            <llm.icon className="w-5 h-5 mr-2" />
            <span>Open in {llm.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
