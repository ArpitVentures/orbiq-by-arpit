const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("User authenticated:", verified.userId);

        req.user = verified;

        next();

    } catch (error) {

        console.log("JWT Error:", error.message);

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;