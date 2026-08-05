import { articleGridClasses } from "@/styles/articleGrid.styles";
import { ArticleCard } from "./ArticleCard";

export function ArticleGrid({
  articles,
  hasMore,
  isLoading,
  error,
  onLoadMore,
  onRetry,
  searchKeyword,
}) {
  const normalizedSearchKeyword = searchKeyword.trim();

  if (isLoading && articles.length === 0) {
    return (
      <section>
        <p className={articleGridClasses.loading}>Loading...</p>
      </section>
    );
  }

  if (error && articles.length === 0) {
    return (
      <section className="mt-20 text-center" role="alert">
        <p className="text-sm font-medium text-rose-300">{error}</p>
        <button
          type="button"
          className="mt-5 rounded-xl border border-violet-500/30 px-6 py-3 text-sm font-medium text-violet-300 hover:bg-violet-500/10"
          onClick={onRetry}
        >
          Try again
        </button>
      </section>
    );
  }

  if (normalizedSearchKeyword && articles.length === 0) {
    return (
      <section>
        <p className={articleGridClasses.emptySearch}>
          Can not find &quot;{normalizedSearchKeyword}&quot;. <br />
          Please, try again
        </p>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section>
        <p className={articleGridClasses.emptySearch}>
          No articles found.
        </p>
      </section>
    );
  }

  return (
    <section>
      {error && (
        <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3" role="alert">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            type="button"
            className="shrink-0 text-sm font-medium text-violet-300 hover:text-violet-200"
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      )}
      <div className={articleGridClasses.grid}>
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-16 text-center">
          <button
            type="button"
            className={articleGridClasses.viewMoreButton}
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View more"}
          </button>
        </div>
      )}
    </section>
  );
}
