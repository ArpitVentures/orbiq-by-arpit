import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

api.interceptors.request.use((config) => {

    const token = sessionStorage.getItem("token");

    console.log("Interceptor Token:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Headers:", config.headers);

    return config;
});

export default api;