import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

export const sendHorizonMessage = async (
    message,
    workspaceContext = {}
) => {
    const token = sessionStorage.getItem("token");

    return axios.post(
        `${API_URL}/horizon/chat`,
        {
            message,
            workspaceContext
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};