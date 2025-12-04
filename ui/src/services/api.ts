import axios from 'axios';

let showToast: (message: string, type: 'success' | 'error' | 'info') => void;

export const setupInterceptors = (toastFn: typeof showToast) => {
    showToast = toastFn;
};

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5140/api', // Default .NET API port, might need adjustment
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const token = localStorage.getItem('token');

                if (!refreshToken || !token) {
                    throw new Error("No tokens found");
                }

                const response = await axios.post('http://localhost:5140/api/auth/refresh', {
                    token,
                    refreshToken
                });

                const { token: newToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('token', newToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        if (showToast) {
            const message = error.response?.data?.detail || error.message || "An unexpected error occurred";
            showToast(message, 'error');
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
};

export default api;
