const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader =
        req.header("Authorization");

    console.log("Authorization Header:",authHeader);

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    const token =
        authHeader.replace("Bearer ", "").trim();

    console.log("Token :",token);

    try {

        const verified =
            jwt.verify(
                token,
                "mysecretkey"
            );

        console.log("Verified User:",verified);

        req.user = verified;

        next();

    } catch (error) {

        console.log("JWT Error:", error.message);

        res.status(401).json({
            message: "Invalid token"
        });

    }

};

module.exports = authMiddleware;