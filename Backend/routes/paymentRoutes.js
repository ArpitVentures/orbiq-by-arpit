const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentControllers");

router.post(
    "/create-order",
    authMiddleware,
    paymentController.createOrder
);

router.post(
    "/verify-payment",
    authMiddleware,
    paymentController.verifyPayment
);

module.exports = router;