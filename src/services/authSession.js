let accessToken = null;
const ACCESS_TOKEN_COOKIE = "fit_blueprint_access_token";

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;

  if (typeof document === "undefined") return;

  if (!accessToken) {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`;
    return;
  }

  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=3600; Secure; SameSite=Lax`;
}
