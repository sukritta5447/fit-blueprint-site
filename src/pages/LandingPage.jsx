import { useState, useEffect } from "react";
import { getPosts } from "../services/articlesApi";

import ArticleSection from "../components/ArticleSection";
import { ArticleGrid } from "../components/ArticleGrid";
import { Container } from "../components/common/Container";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { NavBar } from "../components/NavBar";

export function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadPosts() {
      setIsLoading(true);

      try {
        const data = await getPosts({
          category: selectedCategory,
          page,
          limit: 6,
        });

        if (!shouldUpdate) return;

        setPosts((prevPosts) => {
          if (page === 1) return data.posts;

          const postMap = new Map(
            [...prevPosts, ...data.posts].map((post) => [post.id, post])
          );

          return Array.from(postMap.values());
        });
        setHasMore(data.currentPage < data.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      shouldUpdate = false;
    };
  }, [selectedCategory, page]);

  function handleSelectCategory(category) {
    setSelectedCategory(category);
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }

  function handleLoadMore() {
    if (isLoading || !hasMore) return;

    setPage((currentPage) => currentPage + 1);
  }

  const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
  const visiblePosts = posts.filter((post) =>
    post.title.toLowerCase().includes(normalizedSearchKeyword)
  );

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
