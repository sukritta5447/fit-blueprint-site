import { useEffect, useState } from "react";
import { getAllPostsForSearch, getPosts } from "@/services/articlesApi";
import { ADMIN_CONTENT_UPDATED_EVENT } from "@/services/adminContentStorage";

export function usePosts() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    function handleContentUpdated() {
      setRefreshKey((currentKey) => currentKey + 1);
    }

    window.addEventListener(ADMIN_CONTENT_UPDATED_EVENT, handleContentUpdated);

    return () => {
      window.removeEventListener(
        ADMIN_CONTENT_UPDATED_EVENT,
        handleContentUpdated,
      );
    };
  }, []);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadAllPosts() {
      try {
        const loadedPosts = await getAllPostsForSearch();

        if (shouldUpdate) {
          setAllPosts(loadedPosts);
        }
      } catch (error) {
        console.error("Error fetching all posts:", error);
      }
    }

    loadAllPosts();

    return () => {
      shouldUpdate = false;
    };
  }, [refreshKey]);

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
            [...prevPosts, ...data.posts].map((post) => [post.id, post]),
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
  }, [selectedCategory, page, refreshKey]);

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
  const searchResults = normalizedSearchKeyword
    ? allPosts.filter((post) => {
        const searchableText = [
          post.title,
          post.description,
          post.excerpt,
          post.content,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearchKeyword);
      })
    : [];
  const visiblePosts = normalizedSearchKeyword ? searchResults : posts;

  return {
    selectedCategory,
    searchKeyword,
    setSearchKeyword,
    visiblePosts,
    searchResults,
    isLoading,
    hasMore: normalizedSearchKeyword ? false : hasMore,
    handleSelectCategory,
    handleLoadMore,
  };
}
