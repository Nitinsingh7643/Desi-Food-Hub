import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    // Ensure we don't double up /api if NEXT_PUBLIC_API_URL already has it, but your env var is just the domain
    // If NEXT_PUBLIC_API_URL is 'https://...onrender.com', then we need '/api' appended?
    // Wait, usually the env var is the BASE url (domain). The axios instance needs '/api' appended if it's not in the env var.
    // Let's assume env var depends on setup. 
    // Generally: process.env.NEXT_PUBLIC_API_URL + '/api' if env var is just domain.
    // But let's check how it's used elsewhere.

    // Correction: Standard practice is NEXT_PUBLIC_API_URL = 'http://localhost:5000' (no /api).
    // So we append /api here.
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`,
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

export default api;
