import axios from "axios";

const API_BASE_URL = "https://blog-post-project-api.vercel.app";

function formatPostDate(isoDate) {
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
      };
    });
}

function mapPost(post) {
  return {
    ...post,
    excerpt: post.description,
    isoDate: post.date,
    date: formatPostDate(post.date),
    sections: getSectionsFromContent(post.content),
  };
}

export async function getPosts({
  category = "Highlight",
  page = 1,
  limit = 6,
} = {}) {
  const response = await axios.get(`${API_BASE_URL}/posts`, {
    params:
      category === "Highlight"
        ? { page, limit }
        : {
            category,
            page,
            limit,
          },
  });

  return {
    ...response.data,
    posts: response.data.posts.map(mapPost),
  };
}

export async function getPostById(id) {
  const response = await axios.get(`${API_BASE_URL}/posts/${id}`);

  return mapPost(response.data);
}
