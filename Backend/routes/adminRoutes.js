const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminControllers');

const authMiddleware = require('../middleware/authMiddleware');

const adminMiddleware = require('../middleware/adminMiddleware');

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    adminController.getAllUsers
);

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    adminController.getDashboard
);

module.exports = router;