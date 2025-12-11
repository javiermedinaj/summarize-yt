import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-black transition-colors duration-200">
      <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] bg-[size:50px_50px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-4 sm:mb-6 leading-tight transition-colors duration-200">
              YT-AI-RESUME
            </h1>
            
            
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-12 leading-relaxed px-2 sm:px-0 transition-colors duration-200">
                Analiza cualquier video educativo y genera resúmenes inteligentes, flashcards para estudio y prompts de análisis profundo.
              </p>
           
            
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              
              {/* <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                <FaTerminal className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <span className="text-gray-900 font-medium text-sm sm:text-base">Terminal</span>
              </div> */}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
              <a
                href="#web-app"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Try Web App
              </a>
          
            </div>

          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="bg-black dark:bg-gray-900 rounded-lg p-4 sm:p-6 shadow-2xl max-w-sm sm:max-w-md w-full transition-colors duration-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="font-mono text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-tight whitespace-pre-wrap overflow-x-auto transition-colors duration-200">
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
                <div className="text-gray-400">  --prompt      Generate a custom prompt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
 
    </div>
  );
};