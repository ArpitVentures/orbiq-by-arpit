const User = require("../models/User");
const {
    generateHorizonResponse
} = require("../services/horizonService");

const chatWithHorizon = async (req, res) => {
    try {
        const { message, workspaceContext } = req.body;

        console.log("HORIZON MESSAGE:", message);
        console.log("HORIZON WORKSPACE CONTEXT:", workspaceContext);

        if (!message || !String(message).trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a message."
            });
        }

        const currentUserId = req.user.userId;

        const user = await User.findById(currentUserId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const response = await generateHorizonResponse({
            message,
            user,
            workspaceContext
        });

        return res.status(200).json({
            success: true,
            response,
            assistant: "HORIZON"
        });

    } catch (error) {
        console.error("HORIZON Error:", error);

        return res.status(500).json({
            success: false,
            message: "HORIZON encountered an internal error."
        });
    }
};

module.exports = {
    chatWithHorizon
};
