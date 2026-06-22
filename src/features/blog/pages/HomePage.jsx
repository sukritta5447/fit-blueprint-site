import { Container } from '../../../components/common/Container'
import { ArticleGrid } from '../components/ArticleGrid'
import { HeroSection } from '../components/HeroSection'

export function HomePage() {
  return (
    <main>
      <Container>
        <HeroSection />
        <ArticleGrid />
      </Container>
    </main>
  )
}
