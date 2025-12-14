import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Always send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - can add auth headers if needed
axiosInstance.interceptors.request.use(
    (config) => {
        // Cookies are sent automatically with withCredentials: true
        // Add any custom headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - could dispatch logout here
            // For now, just let the component handle it
            console.log('Authentication error - user may need to login again');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
