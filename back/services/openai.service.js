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
  if (!text || text.length < 50) {
    throw new Error("Content too short for meaningful analysis");
  }

  try {
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto analista de contenido y redactor profesional especializado en crear resúmenes ejecutivos de alta calidad. Tu objetivo es transformar contenido complejo en información clara, accionable y bien estructurada.

**CRITERIOS DE CALIDAD:**
1. **Completitud Total**: Incluye TODOS los temas, proyectos, experimentos y conceptos mencionados
2. **Estructura Profesional**: Usa jerarquía clara con títulos, subtítulos y viñetas
3. **Tono Adaptativo**: Formal pero accesible, apropiado para audiencias técnicas y ejecutivas
4. **Accionabilidad**: Destaca información práctica y aplicable inmediatamente
5. **Contextualización**: Proporciona contexto cuando sea necesario para comprensión

**ESTRUCTURA OBLIGATORIA:**
## Resumen
- 2-3 oraciones con los puntos más importantes
- Debe capturar la esencia del contenido completo

## Puntos Clave
- Lista numerada de conceptos principales
- Máximo 7-8 puntos
- **IMPORTANTE**: Incluye TODOS los proyectos, experimentos y conceptos mencionados
- Usa viñetas con **negritas** para términos importantes

## Insights Destacados
- Análisis de las ideas más valiosas
- Conexiones entre conceptos
- Implicaciones prácticas
- **NO OMITAS** temas importantes por parecer secundarios

## Aplicaciones Prácticas
- Cómo aplicar esta información
- Ejemplos concretos cuando sea posible
- Pasos accionables

## Conclusiones
- Reflexiones finales
- Recomendaciones específicas
- Próximos pasos sugeridos

**INSTRUCCIONES ESPECÍFICAS:**
- Escribe en español con estilo profesional y académico
- Usa markdown para formato (##, **, -, etc.)
- **CRÍTICO**: Asegúrate de incluir TODOS los temas mencionados, no solo los más obvios
- Mantén un balance entre detalle y concisión
- Prioriza información práctica sobre teórica
- Incluye ejemplos cuando sea relevante
- **NO FILTRES** contenido importante por ser "secundario"`,
        },
        {
          role: "user",
          content: `Analiza y resume el siguiente contenido siguiendo EXACTAMENTE la estructura especificada. Asegúrate de que el resumen sea profesional, estructurado, accionable y COMPLETO - incluyendo TODOS los temas, proyectos y conceptos mencionados:

${text}`,
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

export async function generateFlashcardsFromText(text, maxFlashcards = 6) {
  if (!text || text.length < 50) {
    throw new Error("Content too short for meaningful flashcards");
  }

  try {
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto en diseño instruccional y creación de contenido educativo. Tu tarea es crear flashcards de alta calidad que promuevan el aprendizaje efectivo y la retención de conocimiento.

**CRITERIOS DE CALIDAD:**
1. **Educativamente Efectivas**: Preguntas que promuevan pensamiento crítico y comprensión profunda
2. **Profesionales**: Terminología técnica apropiada y tono formal
3. **Estructuradas**: Preguntas claras y respuestas concisas pero completas
4. **Aplicables**: Enfócate en conceptos prácticos y aplicables
5. **Diversas**: Incluye diferentes tipos de preguntas y niveles de dificultad

**TIPOS DE PREGUNTAS A INCLUIR:**
- **Conceptos Fundamentales**: Definiciones y principios básicos
- **Aplicaciones Prácticas**: Casos de uso y implementaciones
- **Análisis de Situaciones**: Evaluación de escenarios reales
- **Comparaciones y Contrastes**: Diferencias y similitudes entre conceptos
- **Casos de Uso Específicos**: Ejemplos concretos del mundo real
- **Problemas y Soluciones**: Identificación y resolución de desafíos

**FORMATO REQUERIDO:**
JSON array con objetos {question, answer}
- question: Pregunta clara, específica y bien formulada
- answer: Respuesta completa pero concisa (máximo 2-3 oraciones)

**EJEMPLOS DE PREGUNTAS:**
- "¿Cuál es la diferencia principal entre X e Y?"
- "¿Cómo se aplica el concepto de Z en un entorno empresarial?"
- "¿Qué pasos seguirías para implementar X en tu organización?"
- "¿Cuáles son los beneficios y desventajas de Y?"

Escribe en español con terminología técnica apropiada. Return ONLY a valid JSON array, no markdown formatting.`,
        },
        {
          role: "user",
          content: `Crea ${maxFlashcards} flashcards educativas de alta calidad basadas en este contenido. Asegúrate de incluir una variedad de tipos de preguntas. Return ONLY a valid JSON array: ${text}`,
        },
      ],
      max_tokens: 1200, // Aumentado para 6 flashcards
      temperature: 0.7, // Balanceado para flashcards
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

export async function generateDeepDivePrompts(text) {
  if (!text || text.length < 50) {
    throw new Error("Content too short for deep dive prompts");
  }

  try {
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto en diseño de prompts educativos y análisis de contenido. Tu tarea es crear 5 prompts de "Deep Dive" que sean:

**REGLA CRÍTICA: PROMPTS AUTOCONTENIDOS**
Cada prompt DEBE incluir TODO el contexto necesario dentro de sí mismo. Cuando alguien copie el prompt a ChatGPT, Claude o Gemini, debe funcionar perfectamente SIN necesidad del contenido original.

**ESTRUCTURA DE CADA PROMPT:**
1. **Título claro** (ANÁLISIS GENERAL, ANÁLISIS CRÍTICO, etc.)
2. **Contexto incorporado**: Resume los puntos clave del contenido dentro del prompt
3. **Instrucciones específicas**: Qué hacer con ese contexto
4. **Entregable esperado**: Qué formato de respuesta se espera

**LOS 5 PROMPTS DEBEN SER:**

1. **ANÁLISIS GENERAL**
   - Resume el contenido en 2-3 párrafos dentro del prompt
   - Pide análisis de puntos clave, implicaciones, y relaciones
   - Estructura: Resumen + Preguntas específicas + Formato esperado

2. **ANÁLISIS CRÍTICO**
   - Incluye las afirmaciones principales del contenido
   - Pide evaluación crítica desde múltiples perspectivas
   - Solicita argumentos con ejemplos que respalden cada perspectiva

3. **APLICACIÓN PRÁCTICA**
   - Resume el tema central y conceptos clave
   - Pide un plan de acción concreto y aplicable
   - Incluye objetivos específicos, estrategias y métodos de evaluación

4. **CONTEXTO AMPLIADO**
   - Resume el contenido y sus temas principales
   - Pide exploración interdisciplinaria
   - Solicita ensayo que relacione campos de estudio

5. **PENSAMIENTO CRÍTICO**
   - Incluye el argumento filosófico/conceptual principal
   - Plantea preguntas filosóficas o conceptuales profundas
   - Pide reflexión sobre implicaciones y aplicaciones

**FORMATO DE SALIDA REQUERIDO:**
JSON array con 5 objetos, cada uno con:
{
  "number": 1-5,
  "title": "ANÁLISIS GENERAL" | "ANÁLISIS CRÍTICO" | "APLICACIÓN PRÁCTICA" | "CONTEXTO AMPLIADO" | "PENSAMIENTO CRÍTICO",
  "content": "El prompt completo autocontenido de 150-250 palabras que incluye contexto + instrucciones + entregable"
}

**EJEMPLO DE PROMPT AUTOCONTENIDO:**
"Analiza el siguiente concepto presentado: [RESUMEN DEL CONTENIDO EN 2-3 LÍNEAS]. Considerando esta información, examina [INSTRUCCIÓN ESPECÍFICA]. Tu análisis debe incluir: (1) [ASPECTO 1], (2) [ASPECTO 2], y (3) [ASPECTO 3]. Entregable esperado: [FORMATO]"

Escribe en español profesional. Return ONLY valid JSON, no markdown.`,
        },
        {
          role: "user",
          content: `Genera 5 prompts de Deep Dive autocontenidos basados en este contenido. Cada prompt debe incluir el contexto necesario para funcionar independientemente:\n\n${text}`,
        },
      ],
      max_tokens: 2500,
      temperature: 0.8,
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
      if (Array.isArray(parsed) && parsed.length === 5) {
        return parsed;
      } else if (Array.isArray(parsed)) {
        console.warn(`Expected 5 prompts, got ${parsed.length}. Using what we have.`);
        return parsed;
      } else {
        console.warn("Response is not an array");
        return [];
      }
    } catch (parseError) {
      console.warn("Failed to parse JSON for deep dive prompts:", parseError.message);
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (secondError) {
          console.warn("Failed to parse extracted JSON");
        }
      }
      return [];
    }
  } catch (error) {
    console.error("Error in generateDeepDivePrompts:", error);
    throw new Error(`Failed to generate deep dive prompts: ${error.message}`);
  }
}
