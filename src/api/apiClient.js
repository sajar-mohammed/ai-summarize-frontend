import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5001/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
        console.error('[API Error]', message);
        return Promise.reject(error);
    }
);

export default apiClient;
