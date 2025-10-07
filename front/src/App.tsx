import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { WebAppSection } from "./components/WebAppSection";
// import { TerminalSection } from "./components/TerminalSection";
import { Footer } from "./components/Footer";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";

const AppContent = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white overflow-hidden">
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
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
