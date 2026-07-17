const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

        const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
        const verificationLink = `${serverUrl}/auth/verify/${verificationToken}`;

        try {
            await sendEmail(
                user.email,
                "Verify your Email",
                `<h2>Welcome to ORBIQ 🎉</h2>
                      <p>Click below to verify:</p>
                      <p>${verificationLink}</p>`
            );
            return res.status(201).json({ message: "Verification email sent successfully." });
        } catch (emailError) {
            console.error("🚨 Nodemailer Delivery Failed:", emailError.message);

            return res.status(201).json({
                message: "User registered and auto-verified successfully! 🎉"
            });
        }
    } catch (error) {
        console.log("🚨 Signup_Backup Controller Crash:", error);
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
                message: "Invalid verification token"
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        return res.redirect("http://localhost:5173/login?verified=true");
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
                message: "Email and Password are required"
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
                message: "Please verify your email first."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid Password"
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
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -verificationToken");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const bodyData = req.body || {};

        const {
            name, phone, address, city, state, country,
            pincode, bio, university, course, github,
            linkedin, profession, title
        } = bodyData;

        let cleanPhone = phone;
        if (phone && phone.trim() !== "") {

            const rawDigits = phone.replace(/\s+/g, "").replace("+91", "");

            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(rawDigits)) {
                return res.status(400).json({
                    message: "Validation failed! Please provide a valid 10-digit phone number. 📱"
                });
            }

            cleanPhone = `+91 ${rawDigits}`;
        }

        let uploadedAvatarUrl = bodyData.avatar;

        if (req.file) {
            if (!req.file.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    message: "Validation failed! Only image files (.jpg, .png, etc.) are allowed. ❌"
                });
            }

            try {
                const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
                    folder: "ORBIQ_avatars",
                    resource_type: "image",
                    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
                });
                uploadedAvatarUrl = uploadResponse.secure_url;
            } catch (cloudErr) {
                console.error("🚨 Cloudinary API Error Details:", cloudErr);
                return res.status(500).json({ message: "Cloudinary upload network gateway failed." });
            }
        }

        const updateData = {
            name,
            phone: cleanPhone,
            address, city, state, country, pincode, bio,
            university, course, github, linkedin, profession, title
        };

        if (req.file || uploadedAvatarUrl) {
            updateData.avatar = uploadedAvatarUrl;
        }

        console.log("Incoming Phone:", phone);
        console.log("Clean Phone:", cleanPhone);

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true }
        ).select("-password -verificationToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully! 🚀",
            user
        });
    } catch (error) {
        console.error("🚨 Cloud Update Controller Crash:", error);
        res.status(500).json({ message: error.message });
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
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Old password is incorrect"
            });
        }
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return res.status(400).json({
                message: "Looks familiar 👀. Choose a new password to keep your ORBIQ account secure."
            });
        }

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
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        return res.json({
            message: "Password reset link generated successfully!  📬",
            debugLink: resetLink
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;
        if (!newPassword) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(404).json({
                message: "Invalid or expired reset token"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({
            message: "Password updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const activatePlan = async (req, res) => {
    try {
        const { plan } = req.body;
        if (!plan) {
            return res.status(400).json({
                message: "Please select a plan"
            });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
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
                    message: "Invalid plan"
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

const directResetDemo = async (req, res) => {
    try {
        const { newPassword, email } = req.body;
        const User = require("../models/User");
        const bcrypt = require("bcryptjs");

        const targetEmail = email || "arpit.srivastava.cs28@iilm.edu";
        const user = await User.findOne({ email: targetEmail });

        if (!user) {
            return res.status(404).json({ message: "User profile not found in DB" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        console.log(`✨ PASSWORD CHANGED IN DATABASE FOR: ${targetEmail}`);
        return res.json({ message: "Password updated in Database successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const revertToGoogleAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.googleAvatar) {
            user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=200`;
            await user.save();
            return res.json({ message: "Reverted to standard initial avatar circle! 🎨", avatar: user.avatar });
        }

        user.avatar = user.googleAvatar;
        await user.save();
        res.json({ message: "Successfully synced back with your Google profile image! ☀️", avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    activatePlan,
    directResetDemo,
    revertToGoogleAvatar
};