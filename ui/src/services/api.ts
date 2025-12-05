import axios from "axios";

let showToast: (message: string, type: "success" | "error" | "info") => void;

export const setupInterceptors = (toastFn: typeof showToast) => {
  showToast = toastFn;
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:5140/api", // Default .NET API port, might need adjustment
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
      !originalRequest.url.includes("/auth/refresh")
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
      const message =
        error.response?.data?.detail ||
        error.message ||
        "An unexpected error occurred";
      showToast(message, "error");
    }

    return Promise.reject(error);
  }
);

const api = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  defaults: axiosInstance.defaults,
  interceptors: axiosInstance.interceptors,
  deleteCv: (id: number) => axiosInstance.delete(`/cv/${id}`),
  shareCv: (id: number) => axiosInstance.post(`/cv/${id}/share`),
  unshareCv: (id: number) => axiosInstance.post(`/cv/${id}/unshare`),
  getSharedCv: (token: string) => axiosInstance.get(`/cv/shared/${token}`),
  getPublicKey: () =>
    axiosInstance.get<{ publicKey: string }>("/auth/public-key"),
};

export default api;
