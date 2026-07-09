import axios from "axios";
import api from "./api.js";

const API = axios.create({
    baseURL: "http://localhost:3000"
});

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export const createTask = (task) =>
    API.post("/tasks/create", task);

export const getTasks = () =>
    API.get("/tasks");

export const updateTask = (id, task) =>
    API.put(`/tasks/${id}`, task);

export const deleteTask = (id) =>
    API.delete(`/tasks/${id}`);

export const getAnalyticsStats = async () => {
    return await api.get("/tasks/analytics/stats"); // Jo bhi aapka base route configuration hai
};