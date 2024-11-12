import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaFileExport, FaFilePdf, FaFileWord, FaTrash, FaYoutube } from "react-icons/fa";
import { FileUpload } from "./components/FileUpload";
import { Flashcard } from "./components/Flashcard";
import { usePDF } from "react-to-pdf";

async function extractSummary(videoUrl: string): Promise<{ summary: string }> {
  const response = await fetch('http://localhost:5000/api/video/extract-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoUrl }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function extractFlashcards(videoUrl: string): Promise<{ flashcards: Array<{ question: string, answer: string }> }> {
  const response = await fetch('http://localhost:5000/api/video/extract-subtitles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoUrl }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

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

  const exportToNotion = () => {
    const content = `# Summary\n${summary}\n\n# Flashcards\n${flashcards
      .map((card) => `Q: ${card.front}\nA: ${card.back}\n`)
      .join("\n")}`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary-flashcards.md";
    a.click();
  };

  const exportToDoc = () => {
    const content = `Summary:\n${summary}\n\nFlashcards:\n${flashcards
      .map((card) => `Question: ${card.front}\nAnswer: ${card.back}\n`)
      .join("\n")}`;

    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary-flashcards.doc";
    a.click();
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto px-2 py-10">
        <div className="flex flex-col items-center justify-center mb-12">
          <h1 className="text-3xl pt-4 font-bold text-white">
            Summarize Youtube
          </h1>
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
                    src={`https://www.youtube.com/embed/${new URL(videoUrl).searchParams.get("v")}`}
                    title="Video Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="w-full flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaYoutube className="w-5 h-5 text-red-600" />
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                  <button
                    onClick={handleClear}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Clear content"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="w-full mt-6 flex justify-start gap-3">
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm text-gray-500 px-2">Export as:</span>
                    {[
                      {
                        title: 'Export to Markdown',
                        icon: FaFileExport,
                        label: 'MD',
                        onClick: exportToNotion,
                        bgColor: 'bg-purple-100',
                        textColor: 'text-purple-700',
                        hoverBg: 'hover:bg-purple-200'
                      },
                      {
                        title: 'Export to Word',
                        icon: FaFileWord,
                        label: 'DOC',
                        onClick: exportToDoc,
                        bgColor: 'bg-blue-100',
                        textColor: 'text-blue-700',
                        hoverBg: 'hover:bg-blue-200'
                      },
                      {
                        title: 'Export to PDF',
                        icon: FaFilePdf,
                        label: 'PDF',
                        onClick: () => toPDF(),
                        bgColor: 'bg-red-200',
                        textColor: 'text-white-700',
                        hoverBg: 'hover:bg-red-400'
                      }
                    ].map(({ title, icon: Icon, label, onClick, bgColor, textColor, hoverBg }) => (
                      <button
                        key={label}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors 
                          ${bgColor} ${textColor} ${hoverBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={onClick}
                        disabled={isGenerating || flashcards.length === 0}
                        title={title}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
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
        Some videos can't be processed
      </p>
    </div>
  );
}

export default App;