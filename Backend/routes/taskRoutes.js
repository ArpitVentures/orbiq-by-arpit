const express = require("express");

const router =
    express.Router();

const taskController =
    require("../controllers/taskControllers");

const authMiddleware =
    require("../middleware/authMiddleware");

router.post(
    "/create",
    authMiddleware,
    taskController.createTask
);

router.get(
    "/",
    authMiddleware,
    taskController.getTasks
);

router.put(
    "/:id",
    authMiddleware,
    taskController.updateTask
);

router.delete(
    "/:id",
    authMiddleware,
    taskController.deleteTask
);

router.get(
    "/analytics/stats",
    authMiddleware,
    taskController.getAnalytics
);

router.get(
    "/dashboard-summary",
    authMiddleware,
    taskController.getDashboardStats
);

module.exports = router;