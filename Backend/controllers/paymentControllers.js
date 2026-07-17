const User = require("../models/User");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


const createOrder = async (req, res) => {

    try {

        const { plan } = req.body;

        let amount = 0;

        if (plan === "Silver") {
            amount = 199;
        }

        if (plan === "Gold") {
            amount = 499;
        }

        if (amount === 0) {
            return res.status(400).json({
                message: "Invalid plan selected"
            });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt:
                `orbiq_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            email,
            plan
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid Payment Signature"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        user.plan = plan;
        user.planStatus = "Active";
        user.planStart = new Date();

        let hours = 1;

        if (plan === "Silver") {
            hours = 6;
        }

        if (plan === "Gold") {
            hours = 12;
        }

        await user.save();

        res.json({
            message: "Payment Successfully Verified",
            plan: user.plan,
            expiry: user.planExpiry
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createOrder,
    verifyPayment
};