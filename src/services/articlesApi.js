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

export async function getPosts(category = "Highlight") {
  const response = await axios.get(`${API_BASE_URL}/posts`, {
    params:
      category === "Highlight"
        ? {}
        : {
            category,
          },
  });

  return response.data.posts.map(mapPost);
}
