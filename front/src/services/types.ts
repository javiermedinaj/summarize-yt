export interface DeepDivePrompt {
  number: number;
  title: string;
  content: string;
  category?: string;
}

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
  deepDivePrompts: DeepDivePrompt[];
  totalPrompts: number;
  flashcards?: Flashcard[];
  videoId: string;
  savedToMongo?: boolean;
  fromCache?: boolean;
  // Mantener compatibilidad con versión anterior
  prompt?: Prompt;
}