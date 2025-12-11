import React from "react";
import { FileUpload } from "./FileUpload";
import { VideoPlayer } from "./VideoPlayer";
import { ContentTabs } from "./ContentTabs";
import { ContentDisplay } from "./ContentDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { extractSummary, generateFlashcards } from "../services/api";
import { Flashcard, Prompt, DeepDivePrompt } from "../services/types";
import { useState } from "react";

type TabType = "summary" | "flashcards" | "prompt";

export const WebAppSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [prompt, setPrompt] = useState<Prompt | undefined>(undefined);
  const [deepDivePrompts, setDeepDivePrompts] = useState<DeepDivePrompt[]>([]);

  const handleUrlSubmit = async (url: string) => {
    setVideoUrl(url);
    setError(null);
    setIsGenerating(true);
    setSummary("");
    setFlashcards([]);
    setPrompt(undefined);

    try {
      const response = await extractSummary(url);
      setSummary(response.summary);
      
      // DEBUG temporal
      // console.log('Response data:', {
      //   hasDeepDivePrompts: !!response.deepDivePrompts,
      //   promptsLength: response.deepDivePrompts?.length || 0,
      //   totalPrompts: response.totalPrompts,
      //   hasFlashcards: !!response.flashcards,
      //   flashcardsLength: response.flashcards?.length || 0,
      //   fromCache: response.fromCache
      // });
      
      if (response.deepDivePrompts && response.deepDivePrompts.length > 0) {
        setDeepDivePrompts(response.deepDivePrompts);
      }
      
      if (response.prompt) {
        setPrompt(response.prompt);
      }

      // Usar las flashcards que ya vienen en la respuesta (ya están generadas en el backend)
      if (response.flashcards && response.flashcards.length > 0) {
        setFlashcards(response.flashcards);
      } else {
        // Fallback: solo si no vienen flashcards, generarlas
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const flashcardsData = await generateFlashcards(response.summary);
          setFlashcards(flashcardsData.flashcards);
        } catch {
          setFlashcards([]);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process video. Please try again."
      );
      // console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setVideoUrl("");
    setSummary("");
    setFlashcards([]);
    setPrompt(undefined);
    setDeepDivePrompts([]);
    setError(null);
    setActiveTab("summary");
  };

  return (
    <section id="web-app" className="py-20 bg-white dark:bg-black overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            YT-AI-RESUME
          </h2>
          
        </div>

        <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-xl dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-200">
          {error && <ErrorMessage message={error} />}

          {!videoUrl && <FileUpload onUrlSubmit={handleUrlSubmit} />}

          {videoUrl && (
            <div className="space-y-6">
              <VideoPlayer videoUrl={videoUrl} onClear={handleClear} />

              {isGenerating ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-6">
                  <ContentTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                  <ContentDisplay
                    activeTab={activeTab}
                    summary={summary}
                    flashcards={flashcards}
                    prompt={prompt}
                    deepDivePrompts={deepDivePrompts}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
