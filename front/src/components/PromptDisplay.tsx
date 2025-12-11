import React, { useState, useMemo } from "react";
import { Prompt, DeepDivePrompt } from "../services/types";
import { FaCopy, FaCheck } from "react-icons/fa";
import { SiOpenai, SiAnthropic, SiGooglegemini } from "react-icons/si";

interface PromptDisplayProps {
  prompt?: Prompt; // Hacer opcional para compatibilidad
  deepDivePrompts?: DeepDivePrompt[];
}

interface ParsedPrompt {
  number: number;
  title: string;
  content: string;
  fullText: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, deepDivePrompts }) => {
  const [copyStates, setCopyStates] = useState<{
    [key: string]: "idle" | "copied";
  }>({});

  // Usar deepDivePrompts si está disponible, sino parsear el prompt antiguo
  const parsedPrompts = useMemo(() => {
    // Si tenemos los nuevos deepDivePrompts, usarlos directamente
    if (deepDivePrompts && deepDivePrompts.length > 0) {
      return deepDivePrompts.map(dp => ({
        number: dp.number,
        title: dp.title,
        content: dp.content,
        fullText: `${dp.title}\n\n${dp.content}`
      }));
    }

    // Fallback: parsear el formato antiguo
    if (!prompt || !prompt.mainPrompt) {
      return [];
    }

    const prompts: ParsedPrompt[] = [];
    const text = prompt.mainPrompt;
    
    // Buscar patrones como "PROMPT 1:", "PROMPT 2:", etc.
    // Patrón mejorado que captura el número, título y contenido completo
    const promptRegex = /PROMPT\s+(\d+)[:：]\s*([^\n]+)(?:\n|$)([\s\S]*?)(?=PROMPT\s+\d+[:：]|$)/gi;
    let match;
    const matches: RegExpExecArray[] = [];

    // Primero, recopilar todos los matches
    while ((match = promptRegex.exec(text)) !== null) {
      matches.push(match);
    }

    // Procesar cada match
    matches.forEach((match) => {
      const number = parseInt(match[1], 10);
      const title = match[2].trim();
      let content = match[3].trim();
      
      // Limpiar el contenido: remover líneas vacías al inicio y final
      content = content.replace(/^\n+|\n+$/g, '');
      
      // Construir el texto completo del prompt (incluyendo el título)
      const fullText = `PROMPT ${number}: ${title}\n${content}`.trim();

      prompts.push({
        number,
        title,
        content,
        fullText,
      });
    });

    // Si no se encontraron prompts con el patrón principal, intentar otros formatos
    if (prompts.length === 0) {
      // Buscar patrones alternativos como "**PROMPT 1:**" o "## PROMPT 1:"
      const altRegex = /(?:PROMPT|Prompt)\s*(\d+)[:：]\s*([^\n]+)(?:\n|$)([\s\S]*?)(?=(?:PROMPT|Prompt)\s*\d+[:：]|$)/gi;
      while ((match = altRegex.exec(text)) !== null) {
        const number = parseInt(match[1], 10);
        const title = match[2].trim();
        let content = match[3].trim();
        content = content.replace(/^\n+|\n+$/g, '');
        const fullText = `PROMPT ${number}: ${title}\n${content}`.trim();

        prompts.push({
          number,
          title,
          content,
          fullText,
        });
      }
    }

    // Si aún no hay prompts, tratar todo el texto como un solo prompt
    if (prompts.length === 0) {
      prompts.push({
        number: 1,
        title: "Prompt Principal",
        content: text,
        fullText: text,
      });
    }

    return prompts.sort((a, b) => a.number - b.number);
  }, [prompt?.mainPrompt, deepDivePrompts]);

  const copyToClipboard = async (content: string, type: string) => {
    const key = `deepdive-${type}`;

    try {
      await navigator.clipboard.writeText(content);

      setCopyStates((prev) => ({ ...prev, [key]: "copied" }));
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [key]: "idle" }));
      }, 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopyStates((prev) => ({ ...prev, [key]: "copied" }));
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [key]: "idle" }));
      }, 2000);
    }
  };

  const renderPromptContent = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc ml-6 mb-3 space-y-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      // Saltar líneas que son títulos de prompt (ya los mostramos arriba)
      if (line.match(/^PROMPT\s+\d+[:：]/i)) {
        flushList();
        return;
      }

      const trimmedLine = line.trim();

      if (trimmedLine === "") {
        flushList();
        elements.push(<br key={`br-${index}`} />);
      } else if (trimmedLine.startsWith("## ")) {
        flushList();
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2"
          >
            {trimmedLine.substring(3)}
          </h3>
        );
      } else if (trimmedLine.startsWith("### ")) {
        flushList();
        elements.push(
          <h4
            key={`h4-${index}`}
            className="text-base font-medium text-gray-700 dark:text-gray-300 mt-3 mb-1"
          >
            {trimmedLine.substring(4)}
          </h4>
        );
      } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        // Acumular items de lista
        currentList.push(trimmedLine.substring(2).trim());
      } else {
        flushList();
        // Procesar texto con negritas
        const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/g);
        if (parts.length > 1) {
          elements.push(
            <p key={`p-${index}`} className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
              {parts.map((part, partIdx) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                  <strong key={partIdx} className="font-semibold text-gray-800 dark:text-gray-200">
                    {part.replace(/\*\*/g, "")}
                  </strong>
                  );
                }
                return <span key={partIdx}>{part}</span>;
              })}
            </p>
          );
        } else {
          elements.push(
          <p key={`p-${index}`} className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
            {trimmedLine}
          </p>
          );
        }
      }
    });

    flushList(); // Asegurar que cualquier lista pendiente se renderice

    return elements;
  };

  const getPromptColor = (number: number) => {
    const colors = [
      { 
        bg: "bg-blue-50 dark:bg-blue-950/50", 
        border: "border-blue-200 dark:border-blue-800/50", 
        header: "bg-blue-100 dark:bg-blue-900/60", 
        text: "text-blue-700 dark:text-blue-300", 
        button: "bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300" 
      },
      { 
        bg: "bg-purple-50 dark:bg-purple-950/50", 
        border: "border-purple-200 dark:border-purple-800/50", 
        header: "bg-purple-100 dark:bg-purple-900/60", 
        text: "text-purple-700 dark:text-purple-300", 
        button: "bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300" 
      },
      { 
        bg: "bg-green-50 dark:bg-green-950/50", 
        border: "border-green-200 dark:border-green-800/50", 
        header: "bg-green-100 dark:bg-green-900/60", 
        text: "text-green-700 dark:text-green-300", 
        button: "bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 text-green-700 dark:text-green-300" 
      },
      { 
        bg: "bg-orange-50 dark:bg-orange-950/50", 
        border: "border-orange-200 dark:border-orange-800/50", 
        header: "bg-orange-100 dark:bg-orange-900/60", 
        text: "text-orange-700 dark:text-orange-300", 
        button: "bg-orange-100 dark:bg-orange-900/40 hover:bg-orange-200 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300" 
      },
      { 
        bg: "bg-pink-50 dark:bg-pink-950/50", 
        border: "border-pink-200 dark:border-pink-800/50", 
        header: "bg-pink-100 dark:bg-pink-900/60", 
        text: "text-pink-700 dark:text-pink-300", 
        button: "bg-pink-100 dark:bg-pink-900/40 hover:bg-pink-200 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300" 
      },
    ];
    return colors[(number - 1) % colors.length];
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-200">
      <div className="bg-blue-50 dark:bg-blue-950/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center transition-colors duration-200">
            <svg
              className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Deep Dive Prompts
          </h3>
          <button
            onClick={() => {
              const allText = parsedPrompts.map(p => p.fullText).join('\n\n---\n\n');
              copyToClipboard(allText, "full");
            }}
            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
              copyStates["deepdive-full"] === "copied"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
            }`}
            title="Copiar todos los prompts"
          >
            {copyStates["deepdive-full"] === "copied" ? (
              <FaCheck className="w-4 h-4 mr-1" />
            ) : (
              <FaCopy className="w-4 h-4 mr-1" />
            )}
            {copyStates["deepdive-full"] === "copied"
              ? "Copiado"
              : "Copiar Todos"}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-white dark:bg-gray-900 transition-colors duration-200">
        {parsedPrompts.map((parsedPrompt) => {
          const colors = getPromptColor(parsedPrompt.number);
          const promptKey = `prompt-${parsedPrompt.number}`;
          
          return (
            <div
              key={parsedPrompt.number}
              className={`${colors.bg} rounded-xl border-2 ${colors.border} shadow-sm dark:shadow-gray-950/50 overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/50`}
            >
              <div className={`${colors.header} px-5 py-3 border-b ${colors.border}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 ${colors.text} font-bold text-sm rounded-full ${colors.bg} border-2 ${colors.border}`}>
                      {parsedPrompt.number}
                    </span>
                    <h4 className={`text-lg font-semibold ${colors.text}`}>
                      {parsedPrompt.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(parsedPrompt.fullText, promptKey)}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                      copyStates[`deepdive-${promptKey}`] === "copied"
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                        : colors.button
                    }`}
                    title={`Copiar ${parsedPrompt.title}`}
                  >
                    {copyStates[`deepdive-${promptKey}`] === "copied" ? (
                      <FaCheck className="w-3 h-3 mr-1.5" />
                    ) : (
                      <FaCopy className="w-3 h-3 mr-1.5" />
                    )}
                    {copyStates[`deepdive-${promptKey}`] === "copied" ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
              <div className="p-5 bg-white dark:bg-transparent">
                <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                  {renderPromptContent(parsedPrompt.content)}
                </div>
              </div>
            </div>
          );
        })}

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 text-center">
            Continuar la conversación en:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://chat.openai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-black dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white transition-all duration-200 transform hover:scale-105 shadow-md dark:shadow-gray-950/50 text-sm"
            >
              <SiOpenai className="w-4 h-4 mr-2" />
              <span>ChatGPT</span>
            </a>

            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-orange-600 dark:bg-orange-700 hover:bg-orange-700 dark:hover:bg-orange-600 text-white transition-all duration-200 transform hover:scale-105 shadow-md dark:shadow-gray-950/50 text-sm"
            >
              <SiAnthropic className="w-4 h-4 mr-2" />
              <span>Claude</span>
            </a>

            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-md dark:shadow-gray-950/50 text-sm"
            >
              <SiGooglegemini className="w-4 h-4 mr-2" />
              <span>Gemini</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
