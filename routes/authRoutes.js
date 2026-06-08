const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/authControllers");

router.post(
    "/signup",
    authController.signup
);

router.get(
    "/users",
    authController.getUsers
);

router.get(
    "/verify/:token",
    authController.verifyEmail
);

module.exports = router;