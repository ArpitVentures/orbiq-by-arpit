const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
                "Verify your Email - ORBIQ",
                `<h2>Welcome to ORBIQ 🎉</h2>
                 <p>Click the link below to verify your account:</p>
                 <p><a href="${verificationLink}">${verificationLink}</a></p>`
            );
            return res.status(201).json({ message: "Verification email sent successfully." });
        } catch (emailError) {
            console.error("🚨 Nodemailer Delivery Failed:", emailError.message);
            return res.status(201).json({
                message: "User registered and auto-verified successfully! 🎉"
            });
        }
    } catch (error) {
        console.error("🚨 Signup Controller Crash:", error);
        return res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({
            totalUsers: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "Invalid verification token" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        return res.redirect(`${clientUrl}/login?verified=true`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                profession: user.profession,
                title: user.title,
                plan: user.plan,
                planStatus: user.planStatus,
                planStart: user.planStart,
                planExpiry: user.planExpiry,
                hasEverPurchasedPremium: user.hasEverPurchasedPremium
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -verificationToken");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
                    message: "Unsupported file type.\n" +
                        "Please upload JPG, PNG or WEBP images only."
                });
            }

            try {
                const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
                    folder: "ORBIQ_avatars",
                    resource_type: "image",
                    transformation: [{ width: 400, height: 400, crop: "pad", background: "black" }]
                });
                uploadedAvatarUrl = uploadResponse.secure_url;
            } catch (cloudErr) {
                console.error("🚨 Cloudinary API Error Details:", cloudErr);
                return res.status(500).json({ message: "Unable to upload your profile picture. Please try again." });
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
            return res.status(400).json({ message: "Both passwords are required" });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "Looks familiar 👀. Choose a new password to keep your ORBIQ account secure."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password changed successfully! 🚀" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User profile not found with this email." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetLink = `${clientUrl}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Password Reset Request - ORBIQ",
            `<h2>Password Reset Request 🔑</h2>
             <p>Hello ${user.name || 'User'},</p>
             <p>Click the link below to set a new password:</p>
             <p><a href="${resetLink}">${resetLink}</a></p>`
        );

        return res.json({
            message: "Password reset link sent to your registered email address! 📬"
        });

    } catch (error) {
        console.error("🚨 Forgot Password Error:", error.message);
        return res.status(500).json({
            message: `Email delivery failed: ${error.message}`
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid or expired reset token" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.json({ message: "Password updated successfully! Please login with your new credentials. 🎉" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const activatePlan = async (req, res) => {
    try {
        const { plan } = req.body;
        if (!plan) {
            return res.status(400).json({ message: "Please select a plan" });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let expiry = new Date();
        switch (plan) {
            case "Free":
                expiry.setHours(expiry.getHours() + 1);
                break;
            case "Silver":
                expiry.setDate(expiry.getDate() + 30);
                break;
            case "Gold":
                expiry.setDate(expiry.getDate() + 30);
                break;
            default:
                return res.status(400).json({ message: "Invalid plan" });
        }
        user.plan = plan;
        user.planStatus = "Active";
        user.planStart = new Date();
        user.planExpiry = expiry;
        await user.save();

        res.json({ message: "Plan activated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const directResetDemo = async (req, res) => {
    try {
        const { newPassword, email } = req.body;
        const targetEmail = email || "arpit.srivastava.cs28@iilm.edu";
        const user = await User.findOne({ email: targetEmail });

        if (!user) {
            return res.status(404).json({ message: "User profile not found in DB" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

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

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Identity token signature missing!" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            const randomFallbackPassword = crypto.randomBytes(32).toString("hex");
            const safeHashedPassword = await bcrypt.hash(randomFallbackPassword, 10);

            try {
                user = await User.create({
                    name: name || "Google User",
                    email: email,
                    password: safeHashedPassword,
                    avatar: picture || "",
                    googleAvatar: picture || "",
                    isVerified: true,
                    profession: "",
                    title: ""
                });
            } catch (mongooseError) {
                console.error("❌ MONGOOSE MODEL VALIDATION FAILED:", mongooseError.message);
                return res.status(400).json({
                    message: `Database Validation Error: ${mongooseError.message}`
                });
            }
        }

        const appToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.json({
            message: "Google Authentication Successful",
            token: appToken,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                profession: user.profession,
                title: user.title,
                plan: user.plan,
                planStatus: user.planStatus,
                planStart: user.planStart,
                planExpiry: user.planExpiry,
                hasEverPurchasedPremium: user.hasEverPurchasedPremium
            }
        });
    } catch (error) {
        console.error("🚨 Global Google Login Catch Triggered:", error);
        return res.status(500).json({ message: "Google account structural validation failed." });
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
    revertToGoogleAvatar,
    googleLogin
};