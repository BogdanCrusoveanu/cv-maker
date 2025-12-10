import axios from "axios";
import i18next from "../i18n";

import { config } from "../config";

let showToast: (message: string, type: "success" | "error" | "info") => void;

export const setupInterceptors = (toastFn: typeof showToast) => {
  showToast = toastFn;
};

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true, // Send cookies with requests
});

axiosInstance.interceptors.request.use((config) => {
  // No need to inject token, cookies handle it
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/shared/")
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint. Cookies are sent automatically.
        await axiosInstance.post("/auth/refresh");

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        console.log(
          "Redirecting to login... (Triggered by:",
          originalRequest.url,
          ")"
        );
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    if (showToast) {
      // Use i18next directly
      const detail = error.response?.data?.detail;
      const message = detail
        ? i18next.t(detail)
        : error.message || i18next.t("common.errors.unexpected");
      showToast(message, "error");
    }

    return Promise.reject(error);
  }
);

const api = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  patch: axiosInstance.patch,
  delete: axiosInstance.delete,
  defaults: axiosInstance.defaults,
  interceptors: axiosInstance.interceptors,
  deleteCv: (id: number) => axiosInstance.delete(`/cv/${id}`),
  shareCv: (id: number) => axiosInstance.post(`/cv/${id}/share`),
  unshareCv: (id: number) => axiosInstance.post(`/cv/${id}/unshare`),
  getSharedCv: (token: string) => axiosInstance.get(`/cv/shared/${token}`),
  getPublicKey: () =>
    axiosInstance.get<{ publicKey: string }>("/auth/public-key"),
  uploadPhoto: (id: number, formData: FormData) =>
    axiosInstance.post(`/cv/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getPhoto: (id: number) =>
    axiosInstance.get(`/cv/${id}/photo`, { responseType: "blob" }),
};

export default api;
