import { Container } from "@/components/common/Container";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { LandingSections } from "@/components/LandingSections";
import { NavBar } from "@/components/nav/NavBar";
import { useArticles } from "@/hooks/useArticles";

export function LandingPage() {
  const { visibleArticles } = useArticles();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main><Container><HeroSection /><LandingSections articles={visibleArticles} /></Container></main>
      <Footer />
    </div>
  );
}
