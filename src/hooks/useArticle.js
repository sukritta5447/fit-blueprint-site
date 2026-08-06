import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getArticleById } from "@/services/articlesService";
import { CONTENT_UPDATED_EVENT } from "@/services/contentEvents";

export function useArticle(id, authUserId) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
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

    async function loadArticle() {
      setIsLoading(true);
      setHasError(false);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const data = await getArticleById(id, {
          accessToken: session?.access_token,
        });

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
  }, [authUserId, id, refreshKey]);

  const updateArticle = useCallback((updater) => {
    setArticle((currentArticle) =>
      typeof updater === "function" ? updater(currentArticle) : updater,
    );
  }, []);

  return { article, isLoading, hasError, updateArticle };
}
