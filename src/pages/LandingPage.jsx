import ArticleSection from '../components/ArticleSection'
import { ArticleGrid } from '../components/ArticleGrid'
import { Container } from '../components/common/Container'
import { Footer } from '../components/Footer'
import { HeroSection } from '../components/HeroSection'
import { NavBar } from '../components/NavBar'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />
      <main>
        <Container>
          <HeroSection />
          <ArticleSection />
          <ArticleGrid />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
