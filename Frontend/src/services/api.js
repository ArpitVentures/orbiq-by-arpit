import axios from "axios";
import { toast } from "react-hot-toast";

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

api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || "";

        const isAuthError =
            status === 401 ||
            status === 403 ||
            /invalid token|jwt expired|malformed|unauthorized/i.test(message);

        if (isAuthError) {

            const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
            const currentUserId = currentUser.id || currentUser._id;

            sessionStorage.clear();

            localStorage.setItem(
                "orbiq_logout_event",
                JSON.stringify({
                    timestamp: Date.now(),
                    loggedOutUserId: currentUserId
                })
            );

            toast.error("Invalid session. Redirecting to login...", {
                duration: 1500
            });

            setTimeout(() => {
                window.location.replace("/login");
            }, 1500);

            return new Promise(() => {});
        }

        return Promise.reject(error);
    }
);

export default api;