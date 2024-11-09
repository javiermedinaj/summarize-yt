import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openaiClient = new AzureOpenAI({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_KEY,
    apiVersion: process.env.API_VERSION,
    deployment: process.env.AZURE_GPT_DEPLOYMENT
});

export async function summarizeText(text) {
    const result = await openaiClient.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are an expert summarizer. Summarize the following text."
            },
            {
                role: "user",
                content: `Summarize this text: ${text}`
            }
        ],
        max_tokens: 800,
        temperature: 0.7
    });

    return result.choices[0].message.content.trim();
}

export async function generateFlashcardsFromText(text, maxFlashcards = 5) {
    const result = await openaiClient.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are an expert educational content creator. Create high-quality flashcards with clear questions and concise answers."
            },
            {
                role: "user",
                content: `Create ${maxFlashcards} study flashcards from this text. Format as JSON array with {question, answer} objects: ${text}`
            }
        ],
        max_tokens: 800,
        temperature: 0.7
    });

    return JSON.parse(result.choices[0].message.content);
}