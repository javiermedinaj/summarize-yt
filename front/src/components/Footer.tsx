import React from "react";
import { FaGithub, FaEnvelope } from "react-icons/fa";

interface FooterProps {
  message?: string;
}

export const Footer: React.FC<FooterProps> = ({
  message = "Created by Javier Medina",
}) => {
  

  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              YT-AI-RESUME
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transforma videos de YouTube en conocimiento accionable con IA
            </p>
          </div>

          {/* Links Section */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
              Enlaces
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#web-app"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Aplicación Web
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Documentación
                </a>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="text-center md:text-right">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
              Conecta
            </h4>
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
             
              <a
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
      
              <span className="hidden sm:inline">{message}</span>
              
            </p>
          
          </div>
        </div>
      </div>
    </footer>
  );
};
