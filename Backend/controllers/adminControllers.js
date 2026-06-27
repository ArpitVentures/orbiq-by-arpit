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

            query.name = {
                $regex: search,
                $options: "i"
            };

        }

        if (role) {

            query.role = role;

        }

        if (plan) {

            query.plan = plan;

        }

        const users = await User.find(query)
            .select("-password -verificationToken")
            .skip(skip)
            .limit(limit);

        const totalUsers =
            await User.countDocuments(query);

        res.json({

            currentPage: page,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getDashboard = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const activePlans =
            await User.countDocuments({
                planStatus: "Active"
            });

        const expiredPlans =
            await User.countDocuments({
                planStatus: "Expired"
            });

        const freePlans =
            await User.countDocuments({
                plan: "Free"
            });

        const silverPlans =
            await User.countDocuments({
                plan: "Silver"
            });

        const goldPlans =
            await User.countDocuments({
                plan: "Gold"
            });

        res.json({

            totalUsers,

            activePlans,

            expiredPlans,

            freePlans,

            silverPlans,

            goldPlans

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    getAllUsers,
    getDashboard
};