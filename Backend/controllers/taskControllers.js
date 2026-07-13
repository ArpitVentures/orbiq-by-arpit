const Task = require("../models/Task");

const isValidDueDate = (dateString) => {
    if (!dateString) return true;
    const checkDate = new Date(dateString);
    return !(
        isNaN(checkDate.getTime()) ||
        checkDate.getFullYear() === 1970 ||
        checkDate.getFullYear() > 2100
    );
};

const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate } = req.body;

        if (!isValidDueDate(dueDate)) {
            return res.status(400).json({
                message: "Validation failed! Please provide a realistic and valid due date. 📅"
            });
        }

        const currentUserId = req.user.userId;
        const newTask = await Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            userId: currentUserId
        });

        return res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const allTasks = await Task.find({ userId: currentUserId });

        return res.json({
            totalTasks: allTasks.length,
            tasks: allTasks
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        if (req.body.dueDate && !isValidDueDate(req.body.dueDate)) {
            return res.status(400).json({
                message: "Validation failed! Please provide a realistic and valid due date. 📅"
            });
        }

        const currentUserId = req.user.userId;
        const targetTaskId = req.params.id;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: targetTaskId, userId: currentUserId },
            req.body,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json({
            message: "Task updated successfully",
            task: updatedTask
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const targetTaskId = req.params.id;

        const deletedTask = await Task.findOneAndDelete({
            _id: targetTaskId,
            userId: currentUserId
        });

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json({ message: "Task deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const analyticsTasks = await Task.find({ userId: currentUserId });

        const totalTasks = analyticsTasks.length;
        const completedTasks = analyticsTasks.filter(t => t.status === "Completed").length;
        const pendingTasks = analyticsTasks.filter(t => t.status === "To Do" || t.status === "In Progress").length;

        const productivityScore = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        const currentStreak = req.user?.streak || 0;

        return res.json({
            currentStreak,
            completedTasks,
            pendingTasks,
            productivity: productivityScore,
            tasks: analyticsTasks
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getAnalytics
};