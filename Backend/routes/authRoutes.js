const express = require("express");

const router = express.Router();

const authController = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");

const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.post(
    "/signup",
    authController.signup
);

router.post(
    "/login",
    authController.login
);

router.post(
    "/google-login",
    authController.googleLogin
);

router.post(
    "/forgot-password",
    authController.forgotPassword
);

router.post(
    "/direct-reset-demo",
    authController.directResetDemo
);

router.get(
    "/verify/:token",
    authController.verifyEmail
);

router.get(
    "/users",
    authController.getUsers
);

router.get(
    "/profile",
    authMiddleware,
    authController.profile
);

router.put(
    "/profile",
    authMiddleware,
    upload.single("avatar"),
    authController.updateProfile
);

router.post(
    "/revert-avatar",
    authMiddleware,
    authController.revertToGoogleAvatar
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