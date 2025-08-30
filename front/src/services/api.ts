import { Flashcard, SummaryResponse } from './types';

const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

interface SubtitlesResponse {
  success: boolean;
  subtitles: string;
  videoId: string;
}

interface FlashcardsResponse {
  success: boolean;
  flashcards: Flashcard[];
}

export async function extractSummary(videoUrl: string): Promise<SummaryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/video/extract-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function extractSubtitles(videoUrl: string): Promise<SubtitlesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/video/extract-subtitles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function generateFlashcards(text: string): Promise<FlashcardsResponse> {
  console.log('📡 Enviando petición para generar flashcards...');
  
  const response = await fetch(`${API_BASE_URL}/api/flashcards/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  console.log('📡 Respuesta recibida:', response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Error en la respuesta:', errorData);
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('📦 Datos de flashcards:', data);
  return data;
}