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

export async function summarizeText(text) {
  try {
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto analista de contenido y redactor profesional. Tu tarea es crear resúmenes ejecutivos de alta calidad que sean:

1. **Estructurados y organizados**: Usa títulos, subtítulos y viñetas para facilitar la lectura
2. **Profesionales**: Mantén un tono formal pero accesible, apropiado para un entorno empresarial
3. **Completos**: Incluye puntos clave, insights principales y conclusiones relevantes
4. **Accionables**: Destaca información práctica y aplicable
5. **Contextualizados**: Proporciona contexto cuando sea necesario

Formato del resumen:
- **Resumen Ejecutivo**: 2-3 oraciones con los puntos más importantes
- **Puntos Clave**: Lista de los conceptos principales
- **Insights Destacados**: Análisis de las ideas más valiosas
- **Aplicaciones Prácticas**: Cómo aplicar esta información
- **Conclusiones**: Reflexiones finales y recomendaciones

Escribe en español con un estilo profesional y académico.`,
        },
        {
          role: "user",
          content: `Analiza y resume el siguiente contenido de manera profesional y estructurada: ${text}`,
        },
      ],
      max_tokens: 1200,
      temperature: 0.7,
      top_p: 1,
      model: modelName,
    });

    if (result?.error !== undefined) {
      throw new Error(`OpenAI API Error: ${result.error.message}`);
    }

    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in summarizeText:", error);
    throw new Error(`Failed to summarize text: ${error.message}`);
  }
}

export async function generateFlashcardsFromText(text, maxFlashcards = 5) {
  try {
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto en diseño instruccional y creación de contenido educativo. Tu tarea es crear flashcards de alta calidad que sean:

1. **Educativamente efectivas**: Preguntas que promuevan el pensamiento crítico y la comprensión profunda
2. **Profesionales**: Usa terminología técnica apropiada y mantén un tono formal
3. **Estructuradas**: Preguntas claras y respuestas concisas pero completas
4. **Aplicables**: Enfócate en conceptos prácticos y aplicables
5. **Diversas**: Incluye diferentes tipos de preguntas (conceptos, aplicaciones, análisis)

Tipos de preguntas a incluir:
- Conceptos fundamentales
- Aplicaciones prácticas
- Análisis de situaciones
- Comparaciones y contrastes
- Casos de uso específicos

Formato: JSON array con objetos {question, answer}
- question: Pregunta clara y específica
- answer: Respuesta completa pero concisa

Escribe en español con terminología técnica apropiada. Return ONLY a valid JSON array, no markdown formatting.`,
        },
        {
          role: "user",
          content: `Crea ${maxFlashcards} flashcards educativas de alta calidad basadas en este contenido. Return ONLY a valid JSON array: ${text}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
      model: modelName,
    });

    if (result?.error !== undefined) {
      throw new Error(`OpenAI API Error: ${result.error.message}`);
    }

    let content = result.choices[0].message.content.trim();

    content = content.replace(/```json\s*/g, "").replace(/```\s*$/g, "");

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        console.warn("Response is not an array, returning as single item");
        return [parsed];
      }
    } catch (parseError) {
      console.warn(
        "Failed to parse JSON, attempting to extract JSON from content"
      );

      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.warn("Failed to parse extracted JSON");
        }
      }

      return [{ question: "Error parsing flashcards", answer: content }];
    }
  } catch (error) {
    console.error("Error in generateFlashcardsFromText:", error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
}
