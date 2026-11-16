import axios, { type InternalAxiosRequestConfig } from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const NO_REFRESH_URLS = ["/auth/login", "/auth/refresh-token"];

let refreshPromise: Promise<unknown> | null = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      NO_REFRESH_URLS.some((url) => originalRequest.url?.includes(url))
    ) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    refreshPromise = (
      refreshPromise || axiosClient.post("/auth/refresh-token")
    ).finally(() => (refreshPromise = null));
    try {
      await refreshPromise;
    } catch {
      return Promise.reject(error);
    }

    return axiosClient(originalRequest);
  },
);
