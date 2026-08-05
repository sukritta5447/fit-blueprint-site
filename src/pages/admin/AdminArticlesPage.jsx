import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteAdminArticle,
  getAdminArticles,
  getAdminCategories,
} from "@/services/adminContentService";
import { getApiErrorMessage } from "@/services/apiClient";
import {
  ARTICLE_STATUS_OPTIONS,
  adminArticlesPageClasses,
} from "@/styles/adminArticlesPage.styles";
import { Input } from "@/components/ui/input";
import { AdminDeleteArticleDialog } from "@/components/admin/AdminDeleteArticleDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PublishedStatus() {
  return (
    <span className={adminArticlesPageClasses.statusPublished}>
      <span className={adminArticlesPageClasses.statusDot} aria-hidden="true" />
      Published
    </span>
  );
}

function DraftStatus() {
  return (
    <span className="inline-flex items-center gap-2 font-medium text-neutral-500">
      <span className="size-2 rounded-full bg-neutral-400" aria-hidden="true" />
      Draft
    </span>
  );
}

function ArticleStatus({ status }) {
  if (status === "draft") {
    return <DraftStatus />;
  }

  return <PublishedStatus />;
}

export function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [articleToDelete, setArticleToDelete] = useState(null);

  const loadContent = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);

    try {
      const [nextArticles, nextCategories] = await Promise.all([
        getAdminArticles(),
        getAdminCategories(),
      ]);
      setArticles(nextArticles);
      setCategories(nextCategories);
    } catch (error) {
      toast.error("Unable to load articles", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(loadContent);
  }, [loadContent]);

  const filteredArticles = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return articles.filter((article) => {
      const articleStatus = article.status || "published";
      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || articleStatus === selectedStatus;
      const matchesKeyword =
        !keyword ||
        [article.title, article.excerpt, article.category, article.author]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchesCategory && matchesStatus && matchesKeyword;
    });
  }, [articles, searchKeyword, selectedCategory, selectedStatus]);

  async function handleDeleteConfirm() {
    if (!articleToDelete) return;

    try {
      await deleteAdminArticle(articleToDelete.id);
      toast.success("Article deleted");
      setArticleToDelete(null);
      await loadContent();
    } catch (error) {
      toast.error("Unable to delete article", {
        description: getApiErrorMessage(error),
      });
    }
  }

  return (
    <div className={adminArticlesPageClasses.page}>
      <header className={adminArticlesPageClasses.header}>
        <h1 className={adminArticlesPageClasses.title}>Article management</h1>
        <Link
          to="/admin/articles/new"
          className={adminArticlesPageClasses.createButton}
        >
          <Plus size={16} strokeWidth={2} />
          Create article
        </Link>
      </header>

      <section>
        <div className={adminArticlesPageClasses.toolbar}>
          <div className={adminArticlesPageClasses.searchWrapper}>
            <Input
              type="search"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              className={adminArticlesPageClasses.searchInput}
              aria-label="Search articles"
            />
            <Search
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>

          <div className={adminArticlesPageClasses.filters}>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className={adminArticlesPageClasses.filterSelect}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {ARTICLE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className={adminArticlesPageClasses.filterSelect}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={adminArticlesPageClasses.tableCard}>
          {isLoading ? (
            <p className={adminArticlesPageClasses.emptyState}>
              Loading articles...
            </p>
          ) : filteredArticles.length === 0 ? (
            <p className={adminArticlesPageClasses.emptyState}>
              No articles found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className={adminArticlesPageClasses.table}>
                <thead>
                  <tr className={adminArticlesPageClasses.tableHead}>
                    <th className={adminArticlesPageClasses.tableHeadCell}>
                      Article title
                    </th>
                    <th className={adminArticlesPageClasses.tableHeadCell}>
                      Category
                    </th>
                    <th className={adminArticlesPageClasses.tableHeadCell}>
                      Status
                    </th>
                    <th
                      className={`${adminArticlesPageClasses.tableHeadCell} text-right`}
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article, index) => (
                    <tr
                      key={article.id}
                      className={
                        index % 2 === 0
                          ? adminArticlesPageClasses.tableRowEven
                          : adminArticlesPageClasses.tableRowOdd
                      }
                    >
                      <td
                        className={`${adminArticlesPageClasses.tableCell} ${adminArticlesPageClasses.titleCell}`}
                        title={article.title}
                      >
                        {article.title}
                      </td>
                      <td
                        className={`${adminArticlesPageClasses.tableCell} ${adminArticlesPageClasses.categoryCell}`}
                      >
                        {article.category}
                      </td>
                      <td className={adminArticlesPageClasses.tableCell}>
                        <ArticleStatus status={article.status} />
                      </td>
                      <td
                        className={`${adminArticlesPageClasses.tableCell} ${adminArticlesPageClasses.actionsCell}`}
                      >
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/admin/articles/${article.id}/edit`}
                            className={adminArticlesPageClasses.iconButton}
                            aria-label={`Edit ${article.title}`}
                          >
                            <Pencil size={16} strokeWidth={1.8} />
                          </Link>
                          <button
                            type="button"
                            className={adminArticlesPageClasses.iconButton}
                            aria-label={`Delete ${article.title}`}
                            onClick={() => setArticleToDelete(article)}
                          >
                            <Trash2 size={16} strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {articleToDelete && (
        <AdminDeleteArticleDialog
          onCancel={() => setArticleToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
