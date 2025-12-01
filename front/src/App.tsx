import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { WebAppSection } from "./components/WebAppSection";
// import { TerminalSection } from "./components/TerminalSection";
import { Footer } from "./components/Footer";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const AppContent = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-200">
      <Navbar />
      <Hero title="YT-AI-RESUME" subtitle={t.hero.subtitle} />
      <LogoMarquee />
      <WebAppSection />
      {/* <TerminalSection /> */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
