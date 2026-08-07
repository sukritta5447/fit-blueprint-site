const BACKEND_URL = "https://fit-blueprint-server.vercel.app";

function getCookieValue(cookieHeader, name) {
  const encodedValue = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);

  return encodedValue ? decodeURIComponent(encodedValue) : "";
}

export default async function handler(request, response) {
  const accessToken =
    request.headers.authorization ||
    request.headers["x-access-token"] ||
    getCookieValue(request.headers.cookie, "fit_blueprint_access_token");

  const upstream = await fetch(`${BACKEND_URL}/programs/calculate`, {
    method: request.method,
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json",
    },
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : JSON.stringify(request.body || {}),
  });

  const contentType = upstream.headers.get("content-type");
  if (contentType) response.setHeader("Content-Type", contentType);

  response.status(upstream.status).send(await upstream.text());
}
