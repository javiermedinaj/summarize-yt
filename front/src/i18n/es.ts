import { TranslationStrings } from './types';

export const es: TranslationStrings = {
  navbar: {
    webApp: 'Aplicación Web',
    web: 'Web',
    terminal: 'Terminal',
    terminalComingSoon: 'Terminal (Próximamente)'
  },
  
  nav: {
    summary: 'Resumen',
    flashcards: 'Flashcards',
    deepDive: 'Análisis Profundo',
    terminalApp: 'App Terminal',
  },
  
  hero: {
    title: 'Transforma Videos de YouTube en Conocimiento Accionable',
    subtitle: 'Analiza cualquier video educativo y genera resúmenes inteligentes, flashcards para estudio y prompts de análisis profundo.',
    placeholder: 'Pega la URL del video de YouTube aquí...',
    processButton: 'Procesar Video',
  },
  
  webApp: {
    title: 'Aplicación Web',
    description: 'Prueba la interfaz web. Extrae subtítulos, genera resúmenes y crea flashcards de cualquier video de YouTube.',
  },
  
  results: {
    summary: 'Resumen',
    flashcards: 'Flashcards',
    deepDive: 'Análisis Profundo',
    processing: 'Procesando tu video...',
    error: 'Error al procesar el video',
    copyPrompt: 'Copiar Prompt',
    copyQuestions: 'Copiar Preguntas',
    copied: 'Copiado',
    copy: 'Copiar',
    continueConversation: 'Continuar la conversación en:',
  },
  
  terminal: {
    title: 'Herramienta de Terminal (En Desarrollo)',
    description: 'Analiza tutoriales de programación en YouTube y genera una guía paso a paso con todos los comandos, dependencias y archivos necesarios para replicar el proyecto.',
    builtWithRust: 'Análisis Detallado',
    rustDescription: 'Extrae y organiza todos los comandos, instalaciones y configuraciones mencionados en el tutorial de forma clara y ordenada.',
    nativeTerminal: 'Guía Paso a Paso',
    terminalDescription: 'Genera una lista completa de comandos para ejecutar, archivos para crear y configuraciones necesarias.',
    cliFirst: 'Para Desarrolladores',
    cliDescription: 'Perfecto para seguir tutoriales de manera eficiente sin perderte ningún paso o dependencia.',
    interactive: 'Extracción Inteligente',
    interactiveDescription: 'Identifica comandos npm/pip, estructura de archivos, configuraciones y dependencias automáticamente del contenido del video.',
    installCommand: 'Comando de instalación:'
  },
  
  messages: {
    processing: 'Procesando tu video...',
    success: 'Video procesado exitosamente',
    failed: 'Error al procesar el video',
    invalidUrl: 'URL de YouTube inválida',
    noSubtitles: 'No se encontraron subtítulos para este video',
  },
};
