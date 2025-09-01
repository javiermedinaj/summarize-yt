import { TranslationStrings } from './types';

export const en: TranslationStrings = {
  navbar: {
    webApp: 'Web App',
    web: 'Web',
    terminal: 'Terminal',
    terminalComingSoon: 'Terminal (Coming Soon)'
  },
  
  nav: {
    summary: 'Summary',
    flashcards: 'Flashcards',
    deepDive: 'Deep Dive',
    terminalApp: 'Terminal App',
  },
  
  hero: {
    title: 'Transform YouTube Videos into Actionable Knowledge',
    subtitle: 'Analyze any educational video and generate intelligent summaries, study flashcards, and deep analysis prompts.',
    placeholder: 'Paste YouTube video URL here...',
    processButton: 'Process Video',
  },
  
  webApp: {
    title: 'Web Application',
    description: 'Try web interface. Extract subtitles, generate summaries, and create flashcards from any YouTube video.',
  },
  
  results: {
    summary: 'Summary',
    flashcards: 'Flashcards',
    deepDive: 'Deep Dive',
    processing: 'Processing your video...',
    error: 'Error processing video',
    copyPrompt: 'Copy Prompt',
    copyQuestions: 'Copy Questions',
    copied: 'Copied',
    copy: 'Copy',
    continueConversation: 'Continue the conversation in:',
  },
  
  terminal: {
    title: 'Terminal Tool (In Development)',
    description: 'Analyzes programming tutorials on YouTube and generates a step-by-step guide with all the commands, dependencies, and files needed to replicate the project.',
    builtWithRust: 'Detailed Analysis',
    rustDescription: 'Extracts and organizes all commands, installations, and configurations mentioned in the tutorial in a clear and ordered manner.',
    nativeTerminal: 'Step-by-Step Guide',
    terminalDescription: 'Generates a complete list of commands to execute, files to create, and necessary configurations.',
    cliFirst: 'For Developers',
    cliDescription: 'Perfect for following tutorials efficiently without missing any steps or dependencies.',
    interactive: 'Smart Extraction',
    interactiveDescription: 'Automatically identifies npm/pip commands, file structure, configurations, and dependencies from video content.',
    installCommand: 'Installation command:'
  },
  
  messages: {
    processing: 'Processing your video...',
    success: 'Video processed successfully',
    failed: 'Failed to process video',
    invalidUrl: 'Invalid YouTube URL',
    noSubtitles: 'No subtitles found for this video',
  },
};
