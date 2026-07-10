import axios from "axios";

const API_BASE_URL = "https://blog-post-project-api.vercel.app";

function formatPostDate(isoDate) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}
function mapPost(post) {
  return {
    ...post,
    excerpt: post.description,
    isoDate: post.date,
    date: formatPostDate(post.date),
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
