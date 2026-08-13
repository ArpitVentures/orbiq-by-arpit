import axios from "axios";

const API_URL = "http://localhost:3000/horizon";

export const sendHorizonMessage = async (message) => {
    const token = sessionStorage.getItem("token");

    return await axios.post(
        `${API_URL}/chat`,
        {
            message
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};