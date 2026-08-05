import { useEffect, useState } from "react";
import {
  getAllArticlesForSearch,
  getArticles,
} from "@/services/articlesService";
import { CONTENT_UPDATED_EVENT } from "@/services/contentEvents";

export function useArticles() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    function handleContentUpdated() {
      setRefreshKey((currentKey) => currentKey + 1);
    }

    window.addEventListener(CONTENT_UPDATED_EVENT, handleContentUpdated);

    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, handleContentUpdated);
    };
  }, []);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadAllArticles() {
      try {
        const loadedArticles = await getAllArticlesForSearch();

        if (shouldUpdate) {
          setAllArticles(loadedArticles);
        }
      } catch (error) {
        console.error("Error fetching all articles:", error);
      }
    }

    loadAllArticles();

    return () => {
      shouldUpdate = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadArticles() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getArticles({
          category: selectedCategory,
          page,
          limit: 6,
        });

        if (!shouldUpdate) return;

        setArticles((previousArticles) => {
          if (page === 1) return data.articles;

          const articleMap = new Map(
            [...previousArticles, ...data.articles].map((article) => [
              article.id,
              article,
            ]),
          );

          return Array.from(articleMap.values());
        });
        setHasMore(data.currentPage < data.totalPages);
      } catch (error) {
        console.error("Error fetching articles:", error);

        if (shouldUpdate) {
          setError(
            error.response?.data?.message ||
              error.response?.data?.error ||
              "Unable to load articles. Please try again.",
          );
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      shouldUpdate = false;
    };
  }, [selectedCategory, page, refreshKey]);

  function handleSelectCategory(category) {
    setSelectedCategory(category);
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }

  function handleLoadMore() {
    if (isLoading || !hasMore) return;
    setPage((currentPage) => currentPage + 1);
  }

  function handleRetry() {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setRefreshKey((currentKey) => currentKey + 1);
  }

  const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
  const searchResults = normalizedSearchKeyword
    ? allArticles.filter((article) => {
        const searchableText = [
          article.title,
          article.description,
          article.excerpt,
          article.content,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearchKeyword);
      })
    : [];
  const visibleArticles = normalizedSearchKeyword ? searchResults : articles;

  return {
    selectedCategory,
    searchKeyword,
    setSearchKeyword,
    visibleArticles,
    searchResults,
    isLoading,
    error,
    hasMore: normalizedSearchKeyword ? false : hasMore,
    handleSelectCategory,
    handleLoadMore,
    handleRetry,
  };
}
