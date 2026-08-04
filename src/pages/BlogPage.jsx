import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ArticleSection } from "@/components/articles/ArticleSection";
import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { useArticles } from "@/hooks/useArticles";

export function BlogPage() {
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
    <PageShell>
      <main><Container className="py-14 md:py-20"><div className="max-w-2xl"><p className="forge-kicker">Evidence-based performance</p><h1 className="mt-5 text-4xl font-semibold uppercase text-white md:text-5xl">The <span className="text-violet-400">Forge</span> Blog</h1><p className="mt-5 leading-7 text-slate-400">Science-backed training, nutrition, recovery, and mindset guidance from experienced coaches.</p></div><ArticleSection selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} searchKeyword={searchKeyword} onSearchKeywordChange={setSearchKeyword} searchResults={searchResults} /><ArticleGrid articles={visibleArticles} hasMore={hasMore} isLoading={isLoading} onLoadMore={handleLoadMore} searchKeyword={searchKeyword} /></Container></main>
    </PageShell>
  );
}
