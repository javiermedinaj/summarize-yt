import React from 'react';
import { FaYoutube, FaBrain, FaTerminal } from 'react-icons/fa';

interface HeroProps {
  title: string;
  subtitle?: string;
}

export const Hero: React.FC<HeroProps> = ({ subtitle }) => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid-black/[0.05] bg-[size:50px_50px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-4 sm:mb-6 leading-tight">
              YT-AI-RESUME
            </h1>
            
            {subtitle && (
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-12 leading-relaxed px-2 sm:px-0">
                {subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                <FaYoutube className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                <span className="text-gray-900 font-medium text-sm sm:text-base">YouTube</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                <FaBrain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <span className="text-gray-900 font-medium text-sm sm:text-base">AI</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                <FaTerminal className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <span className="text-gray-900 font-medium text-sm sm:text-base">Terminal</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
              <a
                href="#web-app"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Try Web App
              </a>
              <a
                href="#terminal-app"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Terminal 
              </a>
            </div>

          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="bg-black rounded-lg p-4 sm:p-6 shadow-2xl max-w-sm sm:max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="font-mono text-gray-700 text-xs sm:text-sm leading-tight whitespace-pre-wrap overflow-x-auto">
                <div>██╗   ██╗████████╗    █████╗ ██╗   </div>
                <div>╚██╗ ██╔╝╚══██╔══╝   ██╔══██╗██║   </div>
                <div> ╚████╔╝    ██║      ███████║██║   </div>
                <div>  ╚██╔╝     ██║      ██╔══██║██║   </div>
                <div>   ██║      ██║      ██║  ██║██║   </div>
                <div>   ╚═╝      ╚═╝      ╚═╝  ╚═╝╚═╝  </div>
                <div className="mt-2 text-green-400">$ yt-ai-resume --help</div>
                <div className="text-gray-400">Usage: yt-ai-resume [OPTIONS] &lt;URL&gt;</div>
                <div className="text-gray-400">Options:</div>
                <div className="text-gray-400">  --summary     Generate AI summary</div>
                <div className="text-gray-400">  --flashcard   Create study flashcards</div>
                <div className="text-gray-400">  --chat        Chat using ollama in local</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </div>
  );
};