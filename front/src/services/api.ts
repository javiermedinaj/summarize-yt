import { Flashcard } from './types';

export async function extractSummary(videoUrl: string): Promise<{ summary: string }> {
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

export async function extractFlashcards(videoUrl: string): Promise<{ flashcards: Flashcard[] }> {
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