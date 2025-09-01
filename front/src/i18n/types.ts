// Configuración de idiomas
export type Language = 'es' | 'en';

export interface TranslationStrings {
  // Navbar del sitio web
  navbar: {
    webApp: string;
    web: string;
    terminal: string;
    terminalComingSoon: string;
  };
  
  // Header y navegación
  nav: {
    summary: string;
    flashcards: string;
    deepDive: string;
    terminalApp: string;
  };
  
  // Página principal
  hero: {
    title: string;
    subtitle: string;
    placeholder: string;
    processButton: string;
  };
  
  webApp: {
    title: string;
    description: string;
  };
  
  results: {
    summary: string;
    flashcards: string;
    deepDive: string;
    processing: string;
    error: string;
    copyPrompt: string;
    copyQuestions: string;
    copied: string;
    copy: string;
    continueConversation: string;
  };

  terminal: {
    title: string;
    description: string;
    builtWithRust: string;
    rustDescription: string;
    nativeTerminal: string;
    terminalDescription: string;
    cliFirst: string;
    cliDescription: string;
    interactive: string;
    interactiveDescription: string;
    installCommand: string;
  };
  
  messages: {
    processing: string;
    success: string;
    failed: string;
    invalidUrl: string;
    noSubtitles: string;
  };
}
