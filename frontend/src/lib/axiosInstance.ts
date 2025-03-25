import axios from 'axios';

// Create the instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // your API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach token from localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = sessionStorage.getItem('token'); // Replace 'token' with your key
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
