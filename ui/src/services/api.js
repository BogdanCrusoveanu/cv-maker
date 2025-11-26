import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5140/api', // Default .NET API port, might need adjustment
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
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

                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
