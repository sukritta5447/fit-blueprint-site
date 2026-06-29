const articleCardClasses = {
  image:
    "h-72 w-full object-cover transition duration-500 group-hover:scale-105",
  title:
    "mt-3 text-xl font-semibold leading-tight tracking-tight text-neutral-950 transition group-hover:text-neutral-600",
  excerpt: "mt-3 line-clamp-2 text-sm leading-6 text-neutral-500",
  meta: "mt-4 flex items-center gap-3 text-xs font-medium text-neutral-500",
};

function getAuthorInitials(author) {
  return author
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ArticleMeta({ author, date, isoDate }) {
  const metaItems = [
    {
      key: "author",
      content: author,
    },
    {
      key: "date",
      content: <time dateTime={isoDate}>{date}</time>,
    },
  ];

  return (
    <div className={articleCardClasses.meta}>
      <span className="grid size-5 place-items-center rounded-full bg-amber-100 text-[10px] text-amber-700">
        {getAuthorInitials(author)}
      </span>

      {metaItems.map(({ key, content }, index) => (
        <span key={key} className="contents">
          {index > 0 && <span className="size-1 rounded-full bg-neutral-300" />}
          <span>{content}</span>
        </span>
      ))}
    </div>
  );
}

export function ArticleCard({
  id,
  image,
  category,
  title,
  excerpt,
  author,
  date,
  isoDate,
}) {
  return (
    <article className="group">
      <a href={`/article/${id}`} className="block">
        <div className="overflow-hidden rounded-xl bg-stone-200">
          <img src={image} alt="" className={articleCardClasses.image} />
        </div>

        <div className="mt-4">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {category}
          </span>
          <h3 className={articleCardClasses.title}>{title}</h3>
          <p className={articleCardClasses.excerpt}>{excerpt}</p>
        </div>

        <ArticleMeta author={author} date={date} isoDate={isoDate} />
      </a>
    </article>
  );
}
