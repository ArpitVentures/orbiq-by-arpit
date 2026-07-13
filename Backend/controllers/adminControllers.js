const User = require("../models/User");

const getAllUsers = async (req, res) => {
    try {
        const search = req.query.search || "";
        const role = req.query.role || "";
        const plan = req.query.plan || "";

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (role) {
            query.role = role;
        }

        if (plan) {
            query.plan = plan;
        }

        const [users, totalUsers] =
            await Promise.all([
            User.find(query)
                .select("-password -verificationToken")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        res.json({
            currentPage: page,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboard = async (req, res) => {
    try {

        const [totalUsers, activePlans, expiredPlans, freePlans, silverPlans, goldPlans] =
            await Promise.all([
            User.countDocuments(),
            User.countDocuments({ planStatus: "Active" }),
            User.countDocuments({ planStatus: "Expired" }),
            User.countDocuments({ plan: "Free" }),
            User.countDocuments({ plan: "Silver" }),
            User.countDocuments({ plan: "Gold" })
        ]);

        res.json({
            totalUsers,
            activePlans,
            expiredPlans,
            freePlans,
            silverPlans,
            goldPlans
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, getDashboard };