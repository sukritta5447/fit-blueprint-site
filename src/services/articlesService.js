import axios from "axios";

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL;

function formatArticleDate(isoDate) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

function getSectionsFromContent(content) {
  if (!content) return undefined;

  return content
    .split(/\n(?=##\s)/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [headingLine, ...bodyLines] = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      return {
        heading: headingLine.replace(/^##\s*/, ""),
        paragraphs: bodyLines.filter((line) => !line.startsWith("- ")),
        bullets: bodyLines
          .filter((line) => line.startsWith("- "))
          .map((line) => line.replace(/^-\s*/, "")),
      };
    });
}

export function mapApiArticle(apiArticle) {
  return {
    ...apiArticle,
    author: apiArticle.author?.trim() || "JB Fit Blueprint",
    excerpt: apiArticle.description,
    isoDate: apiArticle.date,
    date: formatArticleDate(apiArticle.date),
    sections: getSectionsFromContent(apiArticle.content),
  };
}

export async function getPublicCategories() {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return ["Highlight", ...response.data.data.map((category) => category.name)];
}

export async function getArticles({
  category = "Highlight",
  page = 1,
  limit = 6,
} = {}) {
  const response = await axios.get(`${API_BASE_URL}/posts`, {
    params:
      category === "Highlight"
        ? { page, limit }
        : {
            category: category.toLowerCase().replace(/\s+/g, "-"),
            page,
            limit,
          },
  });

  return {
    articles: response.data.posts.map(mapApiArticle),
    totalArticles: response.data.totalPosts,
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
}

export async function getArticleById(id, { accessToken } = {}) {
  const response = await axios.get(`${API_BASE_URL}/posts/${id}`, {
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
  });

  return mapApiArticle(response.data);
}

export async function getAllArticlesForSearch() {
  const data = await getArticles({ limit: 100 });
  return data.articles;
}
