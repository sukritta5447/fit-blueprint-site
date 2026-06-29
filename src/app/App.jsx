import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ArticleSection from '../components/ArticleSection'
import { ArticleGrid } from '../components/ArticleGrid'
import { ArticlePage } from '../components/ArticlePage'
import { Container } from '../components/common/Container'
import { Footer, HeroSection, NavBar } from '../components/LandingSections'

function LandingPage() {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
