const User = require("../models/User");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const PLAN_PRICES = {
    silver: 199,
    gold: 499
};

const PLAN_DURATIONS_DAYS = {
    silver: 30,
    gold: 30
};

const createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const planKey = plan ? plan.toLowerCase() : "";
        const amount = PLAN_PRICES[planKey] || 0;

        if (amount === 0) {
            return res.status(400).json({ message: "Invalid plan selected" });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `orbiq_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            plan
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid Payment Signature" });
        }

        const userId = req.user?.userId || req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized payment request context." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User profile not found in database." });
        }

        const currentPlan = (user.plan || "Free").toLowerCase();
        const newPlan = plan.toLowerCase();
        const formattedPlan = plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();

        const isPlanActive = user.planStatus === "Active" && user.planExpiry && new Date(user.planExpiry) > new Date();

        if (currentPlan === newPlan && isPlanActive) {
            return res.status(400).json({
                success: false,
                message: `Your current ${formattedPlan} plan is already active and valid. Redundant billing blocked.`
            });
        }

        const planWeights = { free: 0, silver: 1, gold: 2 };
        const currentWeight = planWeights[currentPlan] || 0;
        const newWeight = planWeights[newPlan] || 0;

        let purchaseType = "first_purchase";

        if (currentPlan !== "free") {
            if (currentPlan === newPlan) {
                purchaseType = "renewal";
            } else if (newWeight > currentWeight) {
                purchaseType = "upgrade";
            } else if (newWeight < currentWeight) {
                purchaseType = "downgrade";
            }
        } else if (user.hasEverPurchasedPremium) {
            purchaseType = "reactivation";
        }

        user.plan = formattedPlan;
        user.planStatus = "Active";
        user.planStart = new Date();
        user.hasEverPurchasedPremium = true;

        const daysToAdd = PLAN_DURATIONS_DAYS[newPlan] || 30;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + daysToAdd);
        user.planExpiry = expiryDate;

        await user.save();

        const cleanUserResponse = user.toObject();
        delete cleanUserResponse.password;
        delete cleanUserResponse.verificationToken;

        res.json({
            success: true,
            message: "Payment Successfully Verified",
            purchaseType,
            user: cleanUserResponse
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, verifyPayment };