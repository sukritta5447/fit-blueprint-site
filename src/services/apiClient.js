import axios from "axios";

import { supabase } from "@/lib/supabase";
import { getAccessToken, setAccessToken } from "@/services/authSession";

const REQUEST_TIMEOUT_MS = 15000;
const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL
  : "/api";

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL environment variable");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

function attachAccessToken(config, accessToken) {
  config.headers.Authorization = `Bearer ${accessToken}`;
}

apiClient.interceptors.request.use(async (config) => {
  const cachedAccessToken = getAccessToken();

  if (cachedAccessToken) {
    attachAccessToken(config, cachedAccessToken);
    return config;
  }

  const sessionResult = await Promise.race([
    supabase.auth.getSession(),
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("AUTH_SESSION_TIMEOUT")),
        REQUEST_TIMEOUT_MS,
      );
    }),
  ]).catch(() => ({
    data: { session: null },
    error: { code: "AUTH_SESSION_UNAVAILABLE" },
  }));

  const {
    data: { session },
    error,
  } = sessionResult;

  if (error) {
    const authError = new Error(
      "Unable to verify your login session. Please sign in again.",
    );
    authError.code = "AUTH_SESSION_UNAVAILABLE";
    return Promise.reject(authError);
  }

  if (!session?.access_token) {
    const authError = new Error(
      "Your login session has expired. Please sign in again.",
    );
    authError.code = "AUTH_SESSION_MISSING";
    return Promise.reject(authError);
  }

  attachAccessToken(config, session.access_token);
  setAccessToken(session.access_token);

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (
      error.response?.status !== 401 ||
      !config ||
      config.__retriedWithFreshToken
    ) {
      return Promise.reject(error);
    }

    config.__retriedWithFreshToken = true;

    const {
      data: { session },
      error: refreshError,
    } = await supabase.auth.refreshSession();

    if (refreshError || !session?.access_token) {
      return Promise.reject(error);
    }

    setAccessToken(session.access_token);
    attachAccessToken(config, session.access_token);
    return apiClient.request(config);
  },
);

export function getApiErrorMessage(error) {
  if (error.code === "AUTH_SESSION_MISSING") {
    return "Your login session has expired. Please sign in again.";
  }

  if (error.code === "AUTH_SESSION_UNAVAILABLE") {
    return "Unable to verify your login session. Please sign in again.";
  }

  if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
    return "The server took too long to respond. Please try again.";
  }

  return (
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred"
  );
}
