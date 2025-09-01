import React, { useState } from "react";
import { Prompt } from "../services/types";
import { FaCopy, FaCheck } from "react-icons/fa";
import { SiOpenai, SiAnthropic, SiGooglegemini } from "react-icons/si";

interface PromptDisplayProps {
  prompt: Prompt;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  const [copyStates, setCopyStates] = useState<{
    [key: string]: "idle" | "copied";
  }>({});

  const copyToClipboard = async (content: string, type: string) => {
    const key = `deepdive-${type}`;

    try {
      await navigator.clipboard.writeText(content);

      setCopyStates((prev) => ({ ...prev, [key]: "copied" }));
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [key]: "idle" }));
      }, 2000);
    } catch (error) {
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

    lines.forEach((line, index) => {
      if (line.startsWith("## ")) {
        elements.push(
          <h3
            key={index}
            className="text-lg font-semibold text-gray-800 mt-4 mb-2"
          >
            {line.substring(3)}
          </h3>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h4
            key={index}
            className="text-base font-medium text-gray-700 mt-3 mb-1"
          >
            {line.substring(4)}
          </h4>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={index} className="text-gray-600 ml-4">
            {line.substring(2)}
          </li>
        );
      } else if (line.trim() === "") {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
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
            Deep Dive Prompt
          </h3>
          <button
            onClick={() => copyToClipboard(prompt.mainPrompt, "full")}
            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
              copyStates["deepdive-full"] === "copied"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
            title="Copiar todo el prompt para usar en Claude/OpenAI"
          >
            {copyStates["deepdive-full"] === "copied" ? (
              <FaCheck className="w-4 h-4 mr-1" />
            ) : (
              <FaCopy className="w-4 h-4 mr-1" />
            )}
            {copyStates["deepdive-full"] === "copied"
              ? "Copiado"
              : "Copiar Prompt"}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-lg">
              Prompt Principal
            </h4>
            <button
              onClick={() => copyToClipboard(prompt.mainPrompt, "main")}
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                copyStates["deepdive-main"] === "copied"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
              title="Copiar prompt principal"
            >
              {copyStates["deepdive-main"] === "copied" ? (
                <FaCheck className="w-3 h-3 mr-1" />
              ) : (
                <FaCopy className="w-3 h-3 mr-1" />
              )}
              {copyStates["deepdive-main"] === "copied" ? "Copiado" : "Copiar"}
            </button>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {renderPromptContent(prompt.mainPrompt)}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4 text-center">
            Continuar la conversación en:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://chat.openai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-200 transform hover:scale-105 shadow-md text-sm"
            >
              <SiOpenai className="w-4 h-4 mr-2" />
              <span>ChatGPT</span>
            </a>

            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200 transform hover:scale-105 shadow-md text-sm"
            >
              <SiAnthropic className="w-4 h-4 mr-2" />
              <span>Claude</span>
            </a>

            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105 shadow-md text-sm"
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
