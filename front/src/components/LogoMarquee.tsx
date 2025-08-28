import React from 'react';
import { FaFileExport, FaSave, FaBrain, FaGraduationCap, FaVideo, FaBook, FaLightbulb, FaChartLine, FaUsers, FaClock, FaSearch, FaDownload } from 'react-icons/fa';

export const LogoMarquee: React.FC = () => {
  const useCases = [
    { icon: FaFileExport, text: 'Export to Obsidian', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { icon: FaSave, text: 'Save Notes', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: FaBrain, text: 'Generate AI Answers', color: 'text-green-600', bgColor: 'bg-green-100' },
    { icon: FaVideo, text: 'Video Analysis', color: 'text-red-600', bgColor: 'bg-red-100' },
    { icon: FaGraduationCap, text: 'Improve Learning', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { icon: FaBook, text: 'Study Materials', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { icon: FaLightbulb, text: 'Smart Insights', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { icon: FaChartLine, text: 'Progress Tracking', color: 'text-teal-600', bgColor: 'bg-teal-100' },
    { icon: FaUsers, text: 'Collaborative Learning', color: 'text-pink-600', bgColor: 'bg-pink-100' },
    { icon: FaClock, text: 'Time Management', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    { icon: FaSearch, text: 'Content Discovery', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    { icon: FaDownload, text: 'Download Resources', color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
  ];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Casos de uso populares
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre cómo YT-AI-RESUME puede transformar tu forma de aprender y procesar contenido
          </p>
        </div>
        
        <div className="marquee-container">
          <div className="flex animate-marquee space-x-8">
            {/* First set of use cases */}
            <div className="flex items-center space-x-8 min-w-full">
              {useCases.map((useCase, index) => (
                <div key={`first-${index}`} className="flex-shrink-0">
                  <div className={`flex items-center gap-3 ${useCase.bgColor} rounded-full px-5 py-3 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                    <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                    <span className="text-gray-900 font-medium text-sm whitespace-nowrap">
                      {useCase.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second set of use cases (duplicate for seamless loop) */}
            <div className="flex items-center space-x-8 min-w-full">
              {useCases.map((useCase, index) => (
                <div key={`second-${index}`} className="flex-shrink-0">
                  <div className={`flex items-center gap-3 ${useCase.bgColor} rounded-full px-5 py-3 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                    <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                    <span className="text-gray-900 font-medium text-sm whitespace-nowrap">
                      {useCase.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};