import axios from "axios";

const API_URL = "https://frd-mini-project-backend.onrender.com/auth";

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
    return await axios.post(`${API_URL}/reset-password/${token}`, data);
};