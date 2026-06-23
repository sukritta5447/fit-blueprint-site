import ArticleSection from '../components/ArticleSection'
import { Container } from '../components/common/Container'
import { Footer, HeroSection, NavBar } from '../components/LandingSections'
import { ArticleGrid } from '../features/blog/components/ArticleGrid'

function App() {
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

export default App
