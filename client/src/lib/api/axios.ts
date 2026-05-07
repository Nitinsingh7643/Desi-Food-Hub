import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add token if it exists
api.interceptors.request.use((config) => {
    // We'll implemented token storage in localStorage later
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

// Add a response interceptor to intercept network errors and provide better messages
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === 'Network Error') {
            const isLocalhost = error.config?.baseURL?.includes('127.0.0.1') || error.config?.baseURL?.includes('localhost');
            const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
            
            if (isLocalhost && isHttps) {
                error.message = "Mixed Content Blocked: You are using the deployed (HTTPS) site but the app is trying to connect to a local (HTTP) server. You MUST set NEXT_PUBLIC_API_URL to your deployed HTTPS backend URL in Vercel/Render.";
            } else if (isLocalhost) {
                error.message = "Backend Unreachable: Make sure you have started your backend server with 'npm run dev' in the server directory and it is running on port 5000.";
            } else {
                error.message = "Network Error: Could not connect to the backend server. Check your NEXT_PUBLIC_API_URL or CORS settings.";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
