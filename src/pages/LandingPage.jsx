import { usePosts } from "@/hooks/usePosts";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleSection } from "@/components/ArticleSection";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { NavBar } from "@/components/NavBar";

export function LandingPage() {
  const {
    selectedCategory,
    searchKeyword,
    setSearchKeyword,
    visiblePosts,
    searchResults,
    isLoading,
    hasMore,
    handleSelectCategory,
    handleLoadMore,
  } = usePosts();

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
            articles={visiblePosts}
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
