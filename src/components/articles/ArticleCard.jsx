import { getInitials } from "@/utils/utils";
import { articleCardClasses } from "@/styles/articleCard.styles";
import { CategoryBadge } from "@/components/ui/CategoryBadge";

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
        {getInitials(author)}
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
          <CategoryBadge>{category}</CategoryBadge>
          <h3 className={articleCardClasses.title}>{title}</h3>
          <p className={articleCardClasses.excerpt}>{excerpt}</p>
        </div>

        {/* isoDate คือ วันที่ของบทความแบบมาตรฐาน ISO 8601 เอาไว้ให้ browser,screen reader อ่านได้*/}
        <ArticleMeta author={author} date={date} isoDate={isoDate} />
      </a>
    </article>
  );
}
