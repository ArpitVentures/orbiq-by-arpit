import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL || "http://localhost:3000"}/auth`;

export const loginUser = async (data) => {
    return await axios.post(`${API_URL}/login`, data);
};

export const registerUser = async (data) => {
    return await axios.post(`${API_URL}/signup`, data);
};

export const forgotPassword = async (data) => {
    return await axios.post(`${API_URL}/forgot-password`, data);
};

export const resetPassword = async (token, data) => {

    console.log("Calling API...");
    console.log(`${API_URL}/reset-password/${token}`);
    console.log(data);

    return await axios.put(
        `${API_URL}/reset-password/${token}`,
        data
    );
};