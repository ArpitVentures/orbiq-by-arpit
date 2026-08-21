const Task = require("../models/Task");
const User = require("../models/User");

const isValidDueDate = (dateString) => {
    if (!dateString) return true;
    const checkDate = new Date(dateString);
    return !(
        isNaN(checkDate.getTime()) ||
        checkDate.getFullYear() === 1970 ||
        checkDate.getFullYear() > 2100
    );
};

const calculateCurrentStreak = (tasks) => {
    const completedDates = new Set();

    tasks.forEach((task) => {
        if (!task.completedAt) return;

        const date = new Date(task.completedAt);

        const dateKey = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata"
        }).format(date);

        completedDates.add(dateKey);
    });

    if (completedDates.size === 0) {
        return 0;
    }

    const today = new Date();

    const todayKey = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata"
    }).format(today);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayKey = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata"
    }).format(yesterday);

    let currentDateKey;

    if (completedDates.has(todayKey)) {
        currentDateKey = todayKey;
    } else if (completedDates.has(yesterdayKey)) {
        currentDateKey = yesterdayKey;
    } else {
        return 0;
    }

    let streak = 0;
    let cursor = new Date(`${currentDateKey}T00:00:00`);

    while (true) {
        const key = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata"
        }).format(cursor);

        if (!completedDates.has(key)) {
            break;
        }

        streak++;

        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
};

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            dueDate
        } = req.body;

        if (!isValidDueDate(dueDate)) {
            return res.status(400).json({
                message:
                    "Validation failed! Please provide a realistic and valid due date. 📅"
            });
        }

        const currentUserId = req.user.userId;

        const user = await User.findById(currentUserId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.plan === "Free") {

            const activeTaskCount = await Task.countDocuments({
                userId: currentUserId,
                status: { $ne: "Completed" }
            });

            if (activeTaskCount >= 3) {
                return res.status(403).json({
                    success: false,
                    code: "ACTIVE_TASK_LIMIT_REACHED",
                    message:
                        "Core Workspace allows up to 3 active tasks at a time. You can create new tasks as you complete existing ones. Upgrade your workspace to unlock unlimited active tasks."
                });
            }
        }

        const newTask = await Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            completedAt: status === "Completed" ? new Date() : null,
            userId: currentUserId
        });

        return res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
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

        const updateData = {
            ...req.body
        };

        if (req.body.status === "Completed") {
            updateData.completedAt = new Date();
        } else if (req.body.status) {
            updateData.completedAt = null;
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: targetTaskId, userId: currentUserId },
            updateData,
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
        const pendingTasks = analyticsTasks.filter(t => t.status !== "Completed").length;

        const productivityScore = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        const currentStreak = calculateCurrentStreak(analyticsTasks);

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

const getDashboardStats = async (req, res) => {
    try {
        const currentUserId = req.user.userId;

        console.log("=== DEBUGGING ORBIQ USER ID COLLISION ===");
        console.log("Current Logged In User ID from Token:", currentUserId);

        const rawDbCount = await Task.countDocuments({});
        console.log("Total Raw Tasks in Database globally:", rawDbCount);

        const user = await User.findById(currentUserId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const allTasks = await Task.find({ userId: currentUserId }).sort({ createdAt: -1 });
        console.log("Filtered Tasks matching this User ID:", allTasks.length);

        const currentStreak = calculateCurrentStreak(allTasks);

        const totalTasks = allTasks.length;

        const pendingTasks = allTasks.filter(t => t.status !== "Completed").length;
        const completedTasks = allTasks.filter(t => t.status === "Completed").length;

        let productivity = "0%";
        if (totalTasks > 0) {
            productivity = `${Math.round((completedTasks / totalTasks) * 100)}%`;
        }

        const pendingTasksArray = allTasks.filter(t => t.status !== "Completed");
        let todayFocus = null;

        if (pendingTasksArray.length > 0) {
            const priorityWeights = { "High": 3, "Medium": 2, "Low": 1 };
            todayFocus = [...pendingTasksArray].sort((a, b) => {
                return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
            })[0];
        }

        const recentTasks = allTasks
            .filter(task => task.status !== "Completed")
            .slice(0, 3);

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                plan: user.plan || "Free",
                planStatus: user.planStatus || "Inactive",
                planExpiry: user.planExpiry
            },
            stats: {
                totalTasks,
                pendingTasks,
                completedTasks,
                productivity,
                currentStreak
            },
            todayFocus,
            recentTasks,
            allTasks
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getHeatmapData = async (req, res) => {
    try {
        const currentUserId = req.user.userId;

        const completedTasks = await Task.find({
            userId: currentUserId,
            status: "Completed",
            completedAt: { $ne: null }
        });

        const densityMap = {};
        completedTasks.forEach((task) => {
            const dateKey = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Kolkata"
            }).format(new Date(task.completedAt));

            densityMap[dateKey] = (densityMap[dateKey] || 0) + 1;
        });

        return res.status(200).json({
            success: true,
            heatmap: densityMap
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getAnalytics,
    getDashboardStats,
    getHeatmapData
};
