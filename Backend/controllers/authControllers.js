const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const signup = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken =
            crypto.randomBytes(16).toString("hex");

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken
        });

        const verificationLink =
            `${process.env.SERVER_URL}/auth/verify/${verificationToken}`;

        await sendEmail(
            user.email,
            "Verify your Email",
            `
            <h2>Welcome to TaskFlow 🎉</h2>

            <p>
                Click the button below to verify your email.
            </p>

            <a
                href="${verificationLink}"
                style="
                    background:#2563eb;
                    color:white;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                "
            >
                Verify Email
            </a>

            <p>If the button doesn't work, copy this link:</p>

            <p>${verificationLink}</p>
            `
        );

        res.status(201).json({
            message: "Verification email sent successfully!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

const getUsers = async (req, res) => {

    try {

        const users = await User.find();

        res.json({
            totalUsers: users.length,
            users
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const verifyEmail = async (req, res) => {

    try {

        const token = req.params.token;

        const user = await User.findOne({
            verificationToken: token
        });

        if (!user) {
            return res.status(404).json({
                message: "Invalid token"
            });
        }

        user.isVerified = true;

        await user.save();

        res.json({
            message: "Email verified successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                message: "Please verify your email first"
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const profile = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.userId
        ).select("-password -verificationToken");

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const updateProfile = async (req, res) => {

    try {

        const {name, phone, address, city, state, country, pincode} = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {name, phone, address, city, state, country, pincode},
            {
                new: true
            }
        ).select("-password -verificationToken");
        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {

    try{

        const{
            oldPassword,
            newPassword
        } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Both passwords are required"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const forgotPassword = async (req, res) => {

    try{

        const {email} = req.body;

        if(!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken =
            crypto.randomBytes(32).toString("hex");

              user.resetPasswordToken = resetToken;

              user.resetPasswordExpiry =
                  new Date(Date.now() + 15*60*1000);

              await user.save();
              console.log(user.resetPasswordToken);
              console.log(user.resetPasswordExpiry);

              res.json({
                  message: "Password reset link generated",
                  resetLink : `http://localhost:3000/user/reset-password/${resetToken}`
              });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {

    try {

        const token = req.params.token;

        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        const user = await User.findOne({

            resetPasswordToken: token,

            resetPasswordExpiry: {
                $gt: new Date()
            }

        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save();

        res.json({
            message: "Password reset successful"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const activatePlan = async (req, res) => {

        try{

            const {plan} = req.body;

            if(!plan) {
                return res.status(400).json({
                    message: "Please select a plan"
                });
            }

            const user = await User.findById(
                req.user.userId
            );

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            let expiry = new Date();

            if (plan === "Free") {

                expiry.setHours(expiry.getHours() + 1);

            } else if (plan === "Silver") {

                expiry.setHours(expiry.getHours() + 6);

            } else if (plan === "Gold") {

                expiry.setHours(expiry.getHours() + 12);

            } else {

                return res.status(400).json({
                    message: "Invalid plan selected"
                });
            }

            user.plan = plan;
            user.planStatus = "Active";
            user.planStart = new Date();
            user.planExpiry = expiry;

            await user.save();
            res.json({
                message: "Plan activated successfully",
                user
                });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
};
module.exports = {
    signup,
    getUsers,
    verifyEmail,
    login,
    profile,
    updateProfile,
    activatePlan,
    changePassword,
    forgotPassword,
    resetPassword
};