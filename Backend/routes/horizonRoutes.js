const express = require("express");

const router = express.Router();

const horizonController =
    require("../controllers/horizonControllers");

const authMiddleware =
    require("../middleware/authMiddleware");

router.post(
    "/chat",
    authMiddleware,
    horizonController.chatWithHorizon
);

module.exports = router;