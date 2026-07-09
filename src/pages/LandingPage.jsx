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

  useEffect(() => {
    async function loadPosts() {
      const data = await getPosts(selectedCategory);
      setPosts(data);
    }
    loadPosts();
  }, [selectedCategory]);

  const visiblePosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />
      <main>
        <Container>
          <HeroSection />
          <ArticleSection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
          />
          <ArticleGrid articles={visiblePosts} />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
