import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_MODEL || "gpt-4o-mini";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";

if (!endpoint || !apiKey) {
  throw new Error(
    "Missing required Azure OpenAI environment variables: AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY"
  );
}

const options = { endpoint, apiKey, deployment, apiVersion };
const openaiClient = new AzureOpenAI(options);

export async function generateDeepDivePrompt(text, area = 'general') {
  console.log('🔍 Generating deep dive prompt for content length:', text.length);
  console.log('🎯 Focus area:', area);
  
  try {
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto en generar prompts para análisis profundo. Tu tarea es crear un conjunto de prompts que ayuden a explorar y entender profundamente el contenido dado.
          
          Los prompts deben:
          1. Ser específicos y focalizados
          2. Promover el pensamiento crítico
          3. Explorar diferentes aspectos del tema
          4. Incluir contexto relevante
          5. Sugerir áreas para profundizar`
        },
        {
          role: "user",
          content: `Genera un conjunto de prompts para profundizar en este contenido, enfocándote en el área: ${area}.
          
          Contenido:
          ${text}`
        }
      ],
      model: modelName,
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('✅ Deep dive prompt generated successfully');

    return {
      mainPrompt: result.choices[0].message.content,
      suggestedQuestions: generateFollowUpQuestions(result.choices[0].message.content),
      context: extractKeyContext(text)
    };
  } catch (error) {
    console.error('❌ Error generating deep dive prompt:', error);
    throw error;
  }
}

function generateFollowUpQuestions(content) {
  // Extraer o generar preguntas de seguimiento basadas en el contenido
  return [
    "¿Cuáles son las implicaciones más importantes de este tema?",
    "¿Qué conexiones existen con otros conceptos relacionados?",
    "¿Cómo se aplica esto en diferentes contextos?",
    "¿Qué aspectos necesitan más investigación?"
  ];
}

function extractKeyContext(text) {
  // Extraer contexto clave del contenido original
  return {
    summary: "Breve resumen del contenido",
    keyPoints: ["Punto clave 1", "Punto clave 2"],
    relevantTopics: ["Tema relacionado 1", "Tema relacionado 2"]
  };
}
