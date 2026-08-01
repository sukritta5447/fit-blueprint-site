import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ArticleSection } from "@/components/articles/ArticleSection";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { NavBar } from "@/components/nav/NavBar";
import { useArticles } from "@/hooks/useArticles";

export function LandingPage() {
  const {
    selectedCategory,
    searchKeyword,
    setSearchKeyword,
    visibleArticles,
    searchResults,
    isLoading,
    hasMore,
    handleSelectCategory,
    handleLoadMore,
  } = useArticles();

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />
      <main>
        <Container>
          <HeroSection />
          <ArticleSection
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
            searchResults={searchResults}
          />
          <ArticleGrid
            articles={visibleArticles}
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            searchKeyword={searchKeyword}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
