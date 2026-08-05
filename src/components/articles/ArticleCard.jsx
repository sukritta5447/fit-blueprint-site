import { Link } from "react-router-dom";

import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { articleCardClasses } from "@/styles/articleCard.styles";
import { getInitials } from "@/utils/utils";

function ArticleMeta({ author, date, isoDate }) {
  const displayAuthor = author?.trim() || "JB Fit Blueprint";

  return (
    <div className={articleCardClasses.meta}>
      <span className="grid size-6 place-items-center rounded-full bg-violet-500/20 text-[10px] text-violet-300">
        {getInitials(displayAuthor)}
      </span>
      <span>{displayAuthor}</span>
      <span className="size-1 rounded-full bg-violet-500/30" />
      <time dateTime={isoDate}>{date}</time>
    </div>
  );
}

export function ArticleCard({ id, image, category, title, excerpt, author, date, isoDate }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-violet-500/20 bg-[#121020]">
      <Link to={`/article/${id}`} className="block">
        <div className="overflow-hidden bg-violet-950/20">
          <img src={image} alt="" className={articleCardClasses.image} />
        </div>
        <div className="p-5">
          <CategoryBadge>{category}</CategoryBadge>
          <h3 className={articleCardClasses.title}>{title}</h3>
          <p className={articleCardClasses.excerpt}>{excerpt}</p>
          <ArticleMeta author={author} date={date} isoDate={isoDate} />
        </div>
      </Link>
    </article>
  );
}
