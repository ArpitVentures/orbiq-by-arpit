const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/authControllers");

const authMiddleware =
    require("../middleware/authMiddleware");

router.post(
    "/signup",
    authController.signup
);

router.post(
    "/login",
    authController.login
);

router.post(
    "/forgot-password",
    authController.forgotPassword
);

router.get(
    "/users",
    authController.getUsers
);

router.get(
    "/verify/:token",
    authController.verifyEmail
);

router.get(
    "/profile",
    authMiddleware,
    authController.profile
);

router.put(
    "/profile",
    authMiddleware,
    authController.updateProfile
);

router.put(
    "/plan",
    authMiddleware,
    authController.activatePlan
);

router.put(
    "/change-password",
    authMiddleware,
    authController.changePassword
);

router.put(
    "/reset-password/:token",
    authController.resetPassword
);

module.exports = router;