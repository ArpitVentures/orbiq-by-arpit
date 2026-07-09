const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
            profession: "",
            title: ""
        });


        const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
        const verificationLink = `${serverUrl}/auth/verify/${verificationToken}`;

        try {
            await sendEmail(
                user.email,
                "Verify your Email",
                `<h2>Welcome to TaskFlow 🎉</h2>
                      <p>Click below to verify:</p>
                      <p>${verificationLink}</p>`
            );
            return res.status(201).json({ message: "Verification email sent successfully." });
        } catch (emailError) {
            console.error("🚨 Nodemailer Delivery Failed:", emailError.message);

            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();

            return res.status(201).json({
                message: "User registered and auto-verified successfully! 🎉"
            });
        }
    } catch (error) {
        console.log("🚨 Signup Controller Crash:", error);
        return res.status(500).json({ message: error.message });
    }
};



const getUsers = async (req, res) => {

    try {

        const users = await User.find();

        res.json({

            totalUsers: users.length,
            users

        });

    }

    catch (error) {

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

                message: "Invalid verification token"

            });

        }

        user.isVerified = true;

        user.verificationToken = undefined;

        await user.save();

        return res.redirect("http://localhost:5173/login?verified=true");

    }

    catch (error) {

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

                message:
                    "Email and Password are required"

            });

        }

        const user = await User.findOne({

            email

        });

        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }

        if (!user.isVerified) {

            return res.status(401).json({

                message:
                    "Please verify your email first."

            });

        }

        const isPasswordCorrect =
            await bcrypt.compare(

                password,
                user.password

            );

        if (!isPasswordCorrect) {

            return res.status(401).json({

                message:
                    "Invalid Password"

            });

        }

        const token = jwt.sign(

            {

                userId: user._id,
                email: user.email

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "30d"

            }

        );

        res.json({

            message: "Login Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role,

                plan: user.plan

            }

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



const profile = async (req, res) => {

    try {

        const user =
            await User.findById(

                req.user.userId

            ).select(

                "-password -verificationToken"

            );

        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }

        res.json(user);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



const updateProfile = async (req, res) => {

    try {

        const {

            name,
            phone,
            address,
            city,
            state,
            country,
            pincode,
            bio,
            university,
            course,
            github,
            linkedin,
            avatar,
            profession,
            title

        } = req.body;

        const user =
            await User.findByIdAndUpdate(

                req.user.userId,

                {

                    name,
                    phone,
                    address,
                    city,
                    state,
                    country,
                    pincode,
                    bio,
                    university,
                    course,
                    github,
                    linkedin,
                    avatar,
                    profession,
                    title
                },

                {

                    new: true

                }

            ).select(

                "-password -verificationToken"

            );

        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }

        res.json({

            message:
                "Profile updated successfully",

            user

        });

    }

    catch (error) {

        console.log(error);
        res.status(500).json({

            message: error.message

        });

    }

};

const changePassword = async (req, res) => {

    try {

        const { oldPassword, newPassword } = req.body;

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

        user.password = await bcrypt.hash(newPassword, 10);

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

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const resetToken =
            crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpiry =
            new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const resetLink =
            `http://localhost:5173/reset-password/${resetToken}`;

        return res.json({
            message: "Password reset link generated successfully! (Demo Mode) 📬",
            debugLink: resetLink // Yeh link frontend direct padh lega
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


const resetPassword = async (req, res) => {
    try {
        const { newPassword, email } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const user = await User.findOne({ email: email || "arpit.srivastava.cs28@iilm.edu" });

        if (!user) {
            return res.status(404).json({ message: "User not found in DB" });
        }

        const bcrypt = require("bcryptjs");
        user.password = await bcrypt.hash(newPassword, 10);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save();

        return res.json({ message: "Password reset successful" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const activatePlan = async (req, res) => {

    try {

        const { plan } = req.body;

        if (!plan) {

            return res.status(400).json({

                message:
                    "Please select a plan"

            });

        }

        const user =
            await User.findById(req.user.userId);

        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }

        let expiry = new Date();

        switch (plan) {

            case "Free":
                expiry.setHours(expiry.getHours() + 1);
                break;

            case "Silver":
                expiry.setHours(expiry.getHours() + 6);
                break;

            case "Gold":
                expiry.setHours(expiry.getHours() + 12);
                break;

            default:

                return res.status(400).json({

                    message:
                        "Invalid plan"

                });

        }

        user.plan = plan;
        user.planStatus = "Active";
        user.planStart = new Date();
        user.planExpiry = expiry;

        await user.save();

        res.json({

            message:
                "Plan activated successfully",

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
    changePassword,
    forgotPassword,
    resetPassword,
    activatePlan

};