export interface Prompt {
  mainPrompt: string;
  context: {
    area: string;
    contentLength: number;
    timestamp: string;
    model?: string;
    tokensUsed?: number;
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