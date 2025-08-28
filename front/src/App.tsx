import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { WebAppSection } from "./components/WebAppSection";
import { TerminalSection } from "./components/TerminalSection";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      <Hero
        title="YT-AI-RESUME"
        subtitle="Transform YouTube videos into actionable learning content with AI-powered summaries and flashcards. Available as a web app and coming soon as a terminal application."
      />

      <LogoMarquee />

      <WebAppSection />

      <TerminalSection />

      <Footer message="Built with ❤️ using React, Node.js, and Azure OpenAI" />
    </div>
  );
}

export default App;