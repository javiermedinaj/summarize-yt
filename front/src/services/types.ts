export interface Prompt {
  mainPrompt: string;
  suggestedQuestions: string[];
  context: {
    summary: string;
    keyPoints: string[];
    relevantTopics: string[];
  };
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface SummaryResponse {
  success: boolean;
  summary: string;
  subtitles: string;
  prompt: Prompt;
  videoId: string;
}