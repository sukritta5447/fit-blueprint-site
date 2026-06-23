import { articles } from '../../../data/articles'
import { ArticleCard } from './ArticleCard'

export function ArticleGrid() {
  return (
    <section>
      <div className="mt-8 grid gap-x-5 gap-y-12 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <a
          href="#more"
          className="text-sm font-semibold text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950"
        >
          View more
        </a>
      </div>
    </section>
  )
}
