import { useState } from "react";
import { Brain, Download, Loader2, Trash2 } from "lucide-react";
import { FileUpload } from "./components/FileUpload";
import { Flashcard } from "./components/Flashcard";
import { extractSummary, extractFlashcards } from "./services/api";
import { usePDF } from "react-to-pdf";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<
    Array<{ front: string; back: string }>
  >([]);
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { toPDF, targetRef } = usePDF({ filename: "flashcards.pdf" });

  const handleUrlSubmit = async (url: string) => {
    setVideoUrl(url);
    setError(null);
    setIsGenerating(true);

    try {
      const summaryData = await extractSummary(url);
      setSummary(summaryData.summary);

      const flashcardsData = await extractFlashcards(url);
      const formattedCards = flashcardsData.flashcards.map((card) => ({
        front: card.question,
        back: card.answer,
      }));
      setFlashcards(formattedCards);
    } catch (err) {
      setError("Failed to generate summary and flashcards. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setVideoUrl("");
    setSummary("");
    setFlashcards([]);
    setError(null);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto px-2 py-10">
        <div className="flex flex-col items-center justify-center mb-12">
          <Brain className="w-10 h-10 text-white" />
          <h1 className="text-3xl pt-4 font-bold text-white">Summarize Youtube</h1>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {!videoUrl && <FileUpload onUrlSubmit={handleUrlSubmit} />}

          {videoUrl && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-full aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${new URL(
                      videoUrl
                    ).searchParams.get("v")}`}
                    title="Video Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-indigo-600 hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-zinc-900" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800 break-all">
                      {videoUrl}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                    onClick={() => toPDF()}
                    disabled={isGenerating || flashcards.length === 0}
                  >
                    <Download className="w-4 h-4 hover:" />
                  </button>
                  <button
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-600 transition-colors"
                    onClick={handleClear}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="mt-4 text-gray-600">
                    Generating your summary and flashcards...
                  </p>
                </div>
              ) : (
                <div ref={targetRef} className="space-y-6">
                  {summary && (
                    <div className="p-4 bg-gray-100 rounded">
                      <h3 className="text-lg font-medium text-gray-700">
                        Summary
                      </h3>
                      <p className="text-gray-700">{summary}</p>
                    </div>
                  )}
                  {flashcards.map((card, index) => (
                    <Flashcard
                      key={index}
                      front={card.front}
                      back={card.back}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="text-white text-center py-4">
        Someone videos can't be proccesed
      </p>
    </div>
  );
}

export default App;
