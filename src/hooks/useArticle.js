import { useEffect, useState } from "react";
import { getPostById } from "@/services/articlesApi";

export function useArticle(id) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let shouldUpdate = true;

    async function loadArticle() {
      setIsLoading(true);
      setHasError(false);

      try {
        const data = await getPostById(id);

        if (shouldUpdate) {
          setArticle(data);
        }
      } catch (error) {
        console.error("Error fetching article:", error);

        if (shouldUpdate) {
          setHasError(true);
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      shouldUpdate = false;
    };
  }, [id]);

  return { article, isLoading, hasError };
}
