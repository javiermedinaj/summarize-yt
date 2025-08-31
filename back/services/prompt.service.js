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
  
  if (!text || text.length < 50) {
    throw new Error("Content too short for meaningful deep dive analysis");
  }
  
  try {
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto en generar prompts para análisis profundo y exploración intelectual. Tu tarea es crear un conjunto de prompts estratégicos que ayuden a explorar y entender profundamente el contenido dado.

**OBJETIVO:**
Crear prompts que faciliten el análisis crítico, la exploración de diferentes perspectivas y la aplicación práctica del conocimiento.

**CRITERIOS DE CALIDAD:**
1. **Específicos y Focalizados**: Cada prompt debe tener un objetivo claro
2. **Pensamiento Crítico**: Promover análisis, evaluación y síntesis
3. **Exploración Multidimensional**: Diferentes aspectos, perspectivas y contextos
4. **Contexto Relevante**: Incluir información contextual cuando sea necesario
5. **Aplicabilidad Práctica**: Sugerir áreas para profundizar con valor real
6. **AUTOCONTENIDO**: Los prompts deben ser comprensibles sin contexto previo

**TIPOS DE PROMPTS A INCLUIR:**
- **Análisis Crítico**: Evaluación de fortalezas, debilidades y limitaciones
- **Aplicación Práctica**: Cómo implementar conceptos en situaciones reales
- **Exploración de Contextos**: Diferentes entornos y situaciones de aplicación
- **Conexiones Interdisciplinarias**: Relaciones con otros campos y conceptos
- **Análisis de Tendencias**: Evolución y futuro del tema
- **Casos de Estudio**: Ejemplos específicos y análisis detallado

**ESTRUCTURA SUGERIDA:**
1. Prompt principal para análisis general
2. Preguntas específicas para diferentes aspectos
3. Ejercicios de aplicación práctica
4. Análisis comparativo con otros enfoques
5. Exploración de implicaciones futuras

**INSTRUCCIONES ESPECÍFICAS:**
- Genera prompts que sean específicos para el área: ${area}
- **CRÍTICO**: Cada prompt debe ser autocontenido y no asumir contexto previo
- Incluye contexto relevante cuando sea necesario
- Asegúrate de que los prompts sean accionables y útiles
- Mantén un tono profesional pero accesible
- **NO HAGAS REFERENCIAS** a "mencionado anteriormente" o "en la conversación"`,
        },
        {
          role: "user",
          content: `Genera un conjunto de prompts para profundizar en este contenido, enfocándote en el área: ${area}.
          
          Contenido:
          ${text}`
        }
      ],
      model: modelName,
      temperature: 0.8, // Más creativo para deep dive
      max_tokens: 1200, // Aumentado para más detalle
    });

    console.log('✅ Deep dive prompt generated successfully');

    return {
      mainPrompt: result.choices[0].message.content,
      suggestedQuestions: generateFollowUpQuestions(result.choices[0].message.content, area),
      context: extractKeyContext(text, area)
    };
  } catch (error) {
    console.error('❌ Error generating deep dive prompt:', error);
    throw error;
  }
}

function generateFollowUpQuestions(content) {
  return [
    "¿Cuáles son las implicaciones más importantes de este tema?",
    "¿Qué conexiones existen con otros conceptos relacionados?",
    "¿Cómo se aplica esto en diferentes contextos?",
    "¿Qué aspectos necesitan más investigación?"
  ];
}
