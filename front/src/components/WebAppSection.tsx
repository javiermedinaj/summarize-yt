import React from 'react';
import { FileUpload } from './FileUpload';
import { VideoPlayer } from './VideoPlayer';
import { ExportButtons } from './ExportButtons';
import { ContentTabs } from './ContentTabs';
import { ContentDisplay } from './ContentDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { usePDF } from 'react-to-pdf';
import { extractSummary, extractSubtitles, generateFlashcards } from '../services/api';
import { Flashcard } from '../services/types';
import { useState } from 'react';

type TabType = 'summary' | 'subtitles' | 'flashcards';

export const WebAppSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [subtitles, setSubtitles] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const { toPDF, targetRef } = usePDF({ filename: "summary.pdf" });

  const handleUrlSubmit = async (url: string) => {
    setVideoUrl(url);
    setError(null);
    setIsGenerating(true);
    setSummary("");
    setSubtitles("");
    setFlashcards([]);

    try {
      const summaryData = await extractSummary(url);
      setSummary(summaryData.summary);
      
      const subtitlesData = await extractSubtitles(url);
      setSubtitles(subtitlesData.subtitles);
      
      const flashcardsData = await generateFlashcards(summaryData.summary);
      setFlashcards(flashcardsData.flashcards);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process video. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setVideoUrl("");
    setSummary("");
    setSubtitles("");
    setFlashcards([]);
    setError(null);
    setActiveTab('summary');
  };

  const exportToMarkdown = () => {
    let content = `# Video Summary\n\n`;
    
    if (summary) {
      content += `## Summary\n${summary}\n\n`;
    }
    
    if (subtitles) {
      content += `## Full Transcript\n${subtitles}\n\n`;
    }
    
    if (flashcards.length > 0) {
      content += `## Flashcards\n\n`;
      flashcards.forEach((card, index) => {
        content += `### ${index + 1}. ${card.question}\n\n${card.answer}\n\n`;
      });
    }
    
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video-summary.md";
    a.click();
  };

  const hasContent = Boolean(summary || subtitles || flashcards.length > 0);

  return (
    <section id="web-app" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Web Application
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Try our web interface now. Extract subtitles, generate summaries, and create flashcards from any YouTube video.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-xl p-6 sm:p-8">
          {error && <ErrorMessage message={error} />}

          {!videoUrl && <FileUpload onUrlSubmit={handleUrlSubmit} />}

          {videoUrl && (
            <div className="space-y-6">
              <VideoPlayer videoUrl={videoUrl} onClear={handleClear} />
              
              <ExportButtons
                onExportMarkdown={exportToMarkdown}
                onExportPDF={() => toPDF()}
                isGenerating={Boolean(isGenerating)}
                hasContent={hasContent}
              />

              {isGenerating ? (
                <LoadingSpinner />
              ) : (
                <div ref={targetRef} className="space-y-6">
                  <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
                  <ContentDisplay
                    activeTab={activeTab}
                    summary={summary}
                    subtitles={subtitles}
                    flashcards={flashcards}
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
