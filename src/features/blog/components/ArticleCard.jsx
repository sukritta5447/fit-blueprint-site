export function ArticleCard({ article }) {
  return (
    <article className="group">
      <a href={`#article-${article.id}`} className="block">
        <div className="overflow-hidden rounded-xl bg-stone-200">
          <img
            src={article.image}
            alt=""
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="mt-4">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {article.category}
          </span>
          <h3 className="mt-3 text-xl font-black leading-tight tracking-tight text-neutral-950 transition group-hover:text-neutral-600">
            {article.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">{article.excerpt}</p>
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs font-medium text-neutral-500">
          <span className="grid size-5 place-items-center rounded-full bg-amber-100 text-[10px] text-amber-700">
            TP
          </span>
          <span>{article.author}</span>
          <span className="size-1 rounded-full bg-neutral-300" />
          <time dateTime={article.isoDate}>{article.date}</time>
        </div>
      </a>
    </article>
  )
}
