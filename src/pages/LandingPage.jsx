import { useState } from 'react'

import ArticleSection from '../components/ArticleSection'
import { ArticleGrid } from '../components/ArticleGrid'
import { Container } from '../components/common/Container'
import { Footer } from '../components/Footer'
import { HeroSection } from '../components/HeroSection'
import { NavBar } from '../components/NavBar'

export function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState('Highlight')

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />
      <main>
        <Container>
          <HeroSection />
          <ArticleSection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ArticleGrid selectedCategory={selectedCategory} />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
