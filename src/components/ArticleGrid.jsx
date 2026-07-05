import { articles } from '../data/articles'
import { ArticleCard } from './ArticleCard'

const articleGridClasses = {
  grid: 'mt-8 grid gap-x-5 gap-y-12 md:grid-cols-2',
  viewMoreLink:
    'text-sm font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950',
}

function getVisibleArticles(selectedCategory) {
  if (selectedCategory === 'Highlight') {
    return articles
  }

  return articles.filter((article) => article.category === selectedCategory)
}

export function ArticleGrid({ selectedCategory }) {
  const visibleArticles = getVisibleArticles(selectedCategory)

  return (
    <section>
      <div className={articleGridClasses.grid}>
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <a
          href="#more"
          className={articleGridClasses.viewMoreLink}
        >
          View more
        </a>
      </div>
    </section>
  )
}
