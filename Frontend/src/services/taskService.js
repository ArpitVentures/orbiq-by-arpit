import api from "./api.js";

export const createTask = (task) =>
    api.post("/tasks/create", task);

export const getTasks = () =>
    api.get("/tasks");

export const updateTask = (id, task) =>
    api.put(`/tasks/${id}`, task);

export const deleteTask = (id) =>
    api.delete(`/tasks/${id}`);

export const getAnalyticsStats = async () => {
    return await api.get("/tasks/analytics/stats");
};