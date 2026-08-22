import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;