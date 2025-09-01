import React from "react";
import { FileUpload } from "./FileUpload";
import { VideoPlayer } from "./VideoPlayer";
import { ContentTabs } from "./ContentTabs";
import { ContentDisplay } from "./ContentDisplay";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { extractSummary, generateFlashcards } from "../services/api";
import { Flashcard, Prompt } from "../services/types";
import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

type TabType = "summary" | "flashcards" | "prompt";

export const WebAppSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [prompt, setPrompt] = useState<Prompt | undefined>(undefined);
  const { t } = useLanguage();

  const handleUrlSubmit = async (url: string) => {
    setVideoUrl(url);
    setError(null);
    setIsGenerating(true);
    setSummary("");
    setFlashcards([]);
    setPrompt(undefined);

    try {
      const response = await extractSummary(url);
      // console.log('API Response:', response); console solo en desarrollo
      setSummary(response.summary);
      setPrompt(response.prompt);

      try {
        // console.log('🔄 Generando flashcards en frontend...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const flashcardsData = await generateFlashcards(response.summary);
        // console.log('✅ Flashcards recibidas:', flashcardsData);
        setFlashcards(flashcardsData.flashcards);
      } catch (flashcardError) {
        // console.error('Error generando flashcards:', flashcardError);
        setFlashcards([]);
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
    setError(null);
    setActiveTab("summary");
  };

  return (
    <section id="web-app" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.webApp.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.webApp.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-xl p-6 sm:p-8">
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
