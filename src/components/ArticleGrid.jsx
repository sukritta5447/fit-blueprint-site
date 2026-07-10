import { ArticleCard } from "./ArticleCard";

const articleGridClasses = {
  grid: "mt-8 grid gap-x-5 gap-y-12 md:grid-cols-2",
  emptySearch: "mt-20 text-center text-sm font-medium text-neutral-950",
  loading: "mt-20 text-center text-sm font-medium text-neutral-950",
  viewMoreButton:
    "text-sm font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950 disabled:cursor-not-allowed disabled:text-neutral-400 disabled:hover:decoration-neutral-300",
};

export function ArticleGrid({
  articles,
  hasMore,
  isLoading,
  onLoadMore,
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

  return (
    <section>
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
