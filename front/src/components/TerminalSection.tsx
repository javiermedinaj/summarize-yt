import React from 'react';
import { FaTerminal, FaRust, FaDownload, FaCode } from 'react-icons/fa';
import { useLanguage } from '../i18n/LanguageContext';

export const TerminalSection: React.FC = () => {
  const { t, } = useLanguage();
  
  return (
    <section id="terminal-app" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-black rounded-full">
              <FaTerminal className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.terminal.title}
          </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.terminal.description}
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-black rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="font-mono text-green-400 text-sm space-y-2">
              <div>$ yt-ai-terminal https://youtube.com/watch?v=react-crud-tutorial</div>
              <div className="text-blue-400">🔍 Analizando contenido del tutorial...</div>
              <div className="text-blue-400">📋 Detectado: Aplicación React CRUD</div>
              <div className="text-yellow-400">📝 Generando guía de comandos...</div>
              <div className="text-white mt-3">═══ GUÍA DE COMANDOS ═══</div>
              <div className="text-gray-300">1. npx create-react-app my-crud-app</div>
              <div className="text-gray-300">2. cd my-crud-app</div>
              <div className="text-gray-300">3. npm install axios react-router-dom</div>
              <div className="text-gray-300">4. Crear: src/components/UserList.js</div>
              <div className="text-gray-300">5. Crear: src/components/UserForm.js</div>
              <div className="text-gray-300">6. Configurar: API service en src/api/</div>
              <div className="text-green-400">✅ Guía generada! Sigue los pasos para replicar el tutorial</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaRust className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.terminal.builtWithRust}</h3>
                <p className="text-gray-600">
                  {t.terminal.rustDescription}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaTerminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.terminal.nativeTerminal}</h3>
                <p className="text-gray-600">
                  {t.terminal.terminalDescription}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.terminal.cliFirst}</h3>
                <p className="text-gray-600">
                  {t.terminal.cliDescription}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-black rounded-lg">
                <FaDownload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.terminal.interactive}</h3>
                <p className="text-gray-600">
                  {t.terminal.interactiveDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

     
      </div>
    </section>
  );
};
