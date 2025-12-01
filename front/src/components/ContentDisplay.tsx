import React, { useState } from 'react';
import { Flashcard, Prompt } from '../services/types';
import { PromptDisplay } from './PromptDisplay';
import { FaDownload, FaCopy, FaFilePdf } from 'react-icons/fa';

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
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const handleExportMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

 

  const handleExportPDF = async (content: string, title: string = 'Resumen') => {
    try {
      // Importación dinámica de jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Configuración
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;
      
      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yPosition);
      yPosition += 10;
      
      // Línea separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      // Contenido
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Dividir el contenido en líneas que quepan en la página
      const lines = doc.splitTextToSize(content, maxWidth);
      
      lines.forEach((line: string) => {
        // Verificar si necesitamos una nueva página
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });
      
      // Guardar PDF
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      // Fallback: descargar como texto
      handleExportMarkdown(content, title);
    }
  };


  const renderSummaryContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listKey = 0;
    let currentNumberedList: string[] = [];
    let numberedListKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
            <ul key={`list-${listKey++}`} className="list-disc ml-6 mb-4 space-y-2">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
      if (currentNumberedList.length > 0) {
        elements.push(
          <ol key={`numbered-${numberedListKey++}`} className="list-decimal ml-6 mb-4 space-y-3">
            {currentNumberedList.map((item, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ol>
        );
        currentNumberedList = [];
      }
    };

    const renderInlineFormatting = (text: string) => {
      // Procesar texto con negritas (**texto**)
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      if (parts.length > 1) {
        return (
          <>
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="font-semibold text-gray-800 dark:text-gray-200">
                    {part.replace(/\*\*/g, '')}
                  </strong>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </>
        );
      }
      return <span>{text}</span>;
    };
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        flushList();
        elements.push(<br key={`br-${index}`} />);
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            {trimmedLine.substring(3)}
          </h3>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h4 key={`h4-${index}`} className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-5 mb-3">
            {trimmedLine.substring(4)}
          </h4>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        // Acumular items de lista con viñetas
        currentList.push(trimmedLine.substring(2).trim());
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        // Detectar listas numeradas (1. texto, 2. texto, etc.)
        flushList(); // Flush listas con viñetas primero
        const numberedItem = trimmedLine.replace(/^\d+\.\s*/, '').trim();
        currentNumberedList.push(numberedItem);
      } else {
        flushList();
        // Procesar párrafos con formato inline
        elements.push(
          <p key={`p-${index}`} className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed text-base">
            {renderInlineFormatting(trimmedLine)}
          </p>
        );
      }
    });

    flushList(); // Asegurar que cualquier lista pendiente se renderice
    
    return elements;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        if (summary) {
          return (
            <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-200">
              <div className="bg-green-50 dark:bg-green-950/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center transition-colors duration-200">
                    <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resumen Ejecutivo
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(summary)}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                        copyState === 'copied'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50'
                      }`}
                      title="Copiar resumen"
                    >
                      {copyState === 'copied' ? (
                        <>
                          <FaCopy className="w-3 h-3 mr-1.5" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-3 h-3 mr-1.5" />
                          Copiar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleExportMarkdown(summary, 'resumen')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50 transition-colors duration-200"
                      title="Exportar como Markdown"
                    >
                      <FaDownload className="w-3 h-3 mr-1.5" />
                      MD
                    </button>
                    <button
                      onClick={() => handleExportPDF(summary, 'Resumen Ejecutivo')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50 transition-colors duration-200"
                      title="Exportar como PDF"
                    >
                      <FaFilePdf className="w-3 h-3 mr-1.5" />
                      PDF
                    </button>
                  
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-white dark:bg-gray-900 transition-colors duration-200">
                <div className="max-w-none">
                  {renderSummaryContent(summary)}
                </div>
              </div>
            </div>
          );
        }
        break;

      case 'flashcards':
        if (flashcards && flashcards.length > 0) {
          const flashcardsText = flashcards.map((card, idx) => 
            `Pregunta ${idx + 1}: ${card.question}\nRespuesta: ${card.answer}\n`
          ).join('\n---\n\n');

          return (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-200">
              <div className="bg-purple-50 dark:bg-purple-950/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center transition-colors duration-200">
                    <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Tarjetas de Estudio
                    <span className="ml-2 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                      {flashcards.length} tarjetas
                    </span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(flashcardsText)}
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                        copyState === 'copied'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50'
                      }`}
                      title="Copiar flashcards"
                    >
                      {copyState === 'copied' ? (
                        <>
                          <FaCopy className="w-3 h-3 mr-1.5" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-3 h-3 mr-1.5" />
                          Copiar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleExportMarkdown(flashcardsText, 'flashcards')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50 transition-colors duration-200"
                      title="Exportar como Markdown"
                    >
                      <FaDownload className="w-3 h-3 mr-1.5" />
                      MD
                    </button>
                    <button
                      onClick={() => handleExportPDF(flashcardsText, 'Flashcards')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50 transition-colors duration-200"
                      title="Exportar como PDF"
                    >
                      <FaFilePdf className="w-3 h-3 mr-1.5" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 transition-colors duration-200">
                <div className="grid gap-6 md:grid-cols-2">
                  {flashcards.map((card, index) => (
                    <div key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-gray-950/50 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200 overflow-hidden">
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full mr-3">
                              Q{index + 1}
                            </span>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Pregunta</span>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{card.question}</p>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full mr-3">
                              A
                            </span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Respuesta</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{card.answer}</p>
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
