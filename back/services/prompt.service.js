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

export async function generateDeepDivePrompt(text, area = "general") {

  if (!text || text.length < 50) {
    console.error("❌ Contenido muy corto para análisis profundo");
    throw new Error("Content too short for meaningful deep dive analysis");
  }

  try {
    console.log("🤖 Llamando a Azure OpenAI...");
    console.log("📊 Configuración:", {
      modelName,
      deployment,
      endpoint: endpoint ? "SET" : "NOT SET",
    });

    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un especialista en crear prompts de análisis profundo que siguen las mejores prácticas de prompting efectivo.

**MISIÓN:**
Generar 5 prompts separados, específicos y accionables que faciliten el análisis crítico y la aplicación práctica del conocimiento.

**PRINCIPIOS DE PROMPTING EFECTIVO:**
1. **CLARIDAD**: Instrucciones específicas y sin ambigüedad
2. **CONTEXTO**: Información suficiente incluida en cada prompt
3. **AUTOCONTENIDO**: Cada prompt funciona independientemente
4. **ESPECÍFICO**: Enfoque claro en un aspecto particular
5. **ACCIONABLE**: Entregables concretos y medibles

**FORMATO REQUERIDO:**
Genera exactamente 5 prompts separados con la siguiente estructura:

PROMPT 1: ANÁLISIS GENERAL
[Prompt autocontenido para análisis general del tema]

PROMPT 2: ANÁLISIS CRÍTICO  
[Prompt autocontenido para evaluación crítica]

PROMPT 3: APLICACIÓN PRÁCTICA
[Prompt autocontenido para implementación práctica]

PROMPT 4: CONTEXTO AMPLIADO
[Prompt autocontenido para exploración interdisciplinaria]

PROMPT 5: PENSAMIENTO CRÍTICO
[Prompt autocontenido para cuestionamiento profundo]

**CRITERIOS PARA CADA PROMPT:**
- Debe ser completamente autocontenido (incluir todo el contexto necesario)
- Especificar rol/perspectiva del usuario
- Incluir contexto del dominio específico
- Dar instrucciones paso a paso claras
- Definir entregable concreto esperado (formato, estructura, no necesariamente longitud exacta)
- Ser directamente copiable y usable en cualquier IA
- Usar guías de longitud flexibles cuando sea útil (ej: "respuesta breve", "análisis detallado")

**IMPORTANTE:**
- NO uses referencias como "según el texto anterior" o "mencionado previamente"
- INCLUYE contexto específico del contenido en cada prompt
- HAZ que cada prompt sea independiente y funcional por sí mismo
- EVITA especificar cantidades exactas de palabras; usa descripciones de alcance (ej: "análisis breve", "respuesta detallada", "lista concisa")
- ENFÓCATE en la calidad y estructura del entregable más que en la longitud específica`,
        },
        {
          role: "user",
          content: `Analiza este contenido y genera 5 prompts de análisis profundo para el área: ${area}

**CONTENIDO A ANALIZAR:**
${
  text.length > 8000
    ? text.substring(0, 8000) +
      "...\n[Contenido truncado para optimizar procesamiento]"
    : text
}

**INSTRUCCIONES:**
1. Identifica los temas y conceptos principales
2. Genera prompts que exploren diferentes dimensiones del contenido
3. Asegúrate de que cada prompt sea autocontenido y específico
4. Incluye el contexto necesario en cada prompt
5. Varía el nivel de análisis en cada prompt

**ÁREA DE ENFOQUE:** ${area}`,
        },
      ],
      model: modelName,
      temperature: 0.8, // Más creativo para deep dive
      max_tokens: 1200, // Aumentado para más detalle
    });

    console.log("✅ Respuesta de Azure OpenAI recibida");
    console.log(
      "📝 Tokens usados:",
      result.usage?.total_tokens || "No disponible"
    );

    const promptResult = {
      mainPrompt: result.choices[0].message.content,
      context: {
        area: area,
        contentLength: text.length,
        timestamp: new Date().toISOString(),
        model: modelName,
        tokensUsed: result.usage?.total_tokens || 0,
      },
    };

    console.log("✅ Deep dive prompt generado exitosamente");
    return promptResult;
  } catch (error) {
    console.error("❌ Error en generateDeepDivePrompt:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
