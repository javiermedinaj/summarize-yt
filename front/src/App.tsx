import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { WebAppSection } from "./components/WebAppSection";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";

const AppContent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-200">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <WebAppSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
        <ThemeProvider>
        <AppContent />
      </ThemeProvider>
  );
}

export default App;
