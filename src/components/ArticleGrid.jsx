import { articleGridClasses } from "@/styles/articleGrid.styles";
import { ArticleCard } from "./ArticleCard";

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
