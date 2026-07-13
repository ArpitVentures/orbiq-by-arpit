const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {

    try {

        console.log("Token User ID:", req.user.userId);

        const user = await User.findById(
            req.user.userId
        );

        console.log("========== ADMIN DEBUG ==========");
        console.log("Token ID:", req.user.userId);
        console.log("User Found:", user);
        console.log("Role:", user?.role);
        console.log("================================");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = adminMiddleware;