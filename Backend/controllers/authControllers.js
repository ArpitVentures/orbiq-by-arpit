const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");
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
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        const testVerificationEnabled = process.env.ALLOW_TEST_VERIFICATION === "true";

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            isVerified: testVerificationEnabled,
            verificationToken: testVerificationEnabled ? undefined : verificationToken,
            verificationTokenExpires: testVerificationEnabled ? undefined : verificationTokenExpires,
            profession: "",
            title: ""
        });

        if (!testVerificationEnabled) {
            const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
            const verificationLink = `${serverUrl}/auth/verify/${verificationToken}`;

            sendEmail(
                user.email,
                "Welcome to ORBIQ 🙏🏻 — Verify Your Account",
                `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#f8fafc; padding:32px 16px;">
        <div style="max-width:560px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:32px;">
            <h1 style="margin:0 0 20px; color:#0f172a; font-size:26px;">
                Welcome to ORBIQ &#128591;&#127995;
            </h1>
            <p style="color:#334155; font-size:16px; line-height:1.6;">
                Namaste &amp; Welcome aboard!
            </p>
            <p style="color:#475569; font-size:15px; line-height:1.7;">
                We're glad to have you with us. Please verify your email address below to step inside the <strong>ORBIQ Workspace/OS</strong>.
            </p>
            <div style="margin:30px 0;">
                <a href="${verificationLink}" style="display:inline-block; padding:13px 24px; background:#06b6d4; color:#ffffff; text-decoration:none; border-radius:8px; font-size:15px; font-weight:600;">
                    Verify Email
                </a>
            </div>
            <p style="color:#64748b; font-size:13px; line-height:1.6;">
                This verification link will expire in <strong>15 minutes</strong>.
            </p>
            <p style="color:#64748b; font-size:13px; line-height:1.6;">
                Need any help? Contact us at <a href="mailto:geniusbillionairearpit@gmail.com" style="color:#0891b2;">geniusbillionairearpit@gmail.com</a>.
            </p>
            <p style="margin-top:28px; color:#334155; font-size:14px;">
                — Team ORBIQ
            </p>
        </div>
    </div>
    `

            ).catch((emailError) => {
                console.error(
                    "🚨 Background Verification Email Error:",
                    emailError.message
                );
            });
        }

        return res.status(201).json({
            message: testVerificationEnabled
                ? "Account created successfully! Test mode active (Auto-verified)."
                : "Account created! Please check your email and verify within 15 minutes."
        });

    } catch (error) {
        console.error("🚨 Signup Controller Crash:", error);
        return res.status(500).json({
            message: "Unable to create your account."
        });
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

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() }
        });

        if (!user) {
            const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
            return res.redirect(`${clientUrl}/login?verified=false&reason=expired`);
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        return res.redirect(`${clientUrl}/login?verified=true`);

    } catch (error) {
        console.error("🚨 Email Verification Error:", error);
        return res.status(500).json({
            message: "Email verification failed."
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first." });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                googleAvatar: user.googleAvatar || null,
                useGooglePhoto: user.useGooglePhoto || false,
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
        console.error("🚨 Login Error:", error);
        return res.status(500).json({ message: "Login failed." });
    }
};

const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified." });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
        const verificationLink = `${serverUrl}/auth/verify/${verificationToken}`;

        await sendEmail(
            user.email,
            "Welcome to ORBIQ 🙏🏻 — Verify Your Account",
            `
            <div style="
                font-family: Arial, Helvetica, sans-serif;
                background:#f8fafc;
                padding:32px 16px;
            ">
                <div style="
                    max-width:560px;
                    margin:0 auto;
                    background:#ffffff;
                    border:1px solid #e2e8f0;
                    border-radius:16px;
                    padding:32px;
                ">

                    <h1 style="
                        margin:0 0 20px;
                        color:#0f172a;
                        font-size:26px;
                    ">
                        Welcome to ORBIQ 🙏🏻
                    </h1>

                    <p style="
                        color:#334155;
                        font-size:16px;
                        line-height:1.6;
                    ">
                        Namaste &amp; Welcome aboard!
                    </p>

                    <p style="
                        color:#475569;
                        font-size:15px;
                        line-height:1.7;
                    ">
                        We're glad to have you with us. Please verify your
                        email address below to step inside the
                        <strong>ORBIQ Workspace/OS</strong>.
                    </p>

                    <div style="margin:30px 0;">
                        <a
                            href="${verificationLink}"
                            style="
                                display:inline-block;
                                padding:13px 24px;
                                background:#06b6d4;
                                color:#ffffff;
                                text-decoration:none;
                                border-radius:8px;
                                font-size:15px;
                                font-weight:600;
                            "
                        >
                            Verify Email
                        </a>
                    </div>

                    <p style="
                        color:#64748b;
                        font-size:13px;
                        line-height:1.6;
                    ">
                        This verification link will expire in
                        <strong>15 minutes</strong>.
                    </p>

                    <p style="
                        color:#64748b;
                        font-size:13px;
                        line-height:1.6;
                    ">
                        Need any help? Contact us at
                        <a
                            href="mailto:geniusbillionairearpit@gmail.com"
                            style="color:#0891b2;"
                        >
                            geniusbillionairearpit@gmail.com
                        </a>.
                    </p>

                    <p style="
                        margin-top:28px;
                        color:#334155;
                        font-size:14px;
                    ">
                        — Team ORBIQ
                    </p>

                </div>
            </div>
            `
        );

        return res.json({ message: "A new verification email has been sent." });

    } catch (error) {
        console.error("🚨 Resend Verification Error:", error);
        return res.status(500).json({ message: "Unable to resend verification email." });
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
            linkedin, profession, title, avatar, useGooglePhoto
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

        let uploadedAvatarUrl = avatar;

        if (req.file) {
            if (!req.file.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    message: "Unsupported file type.\nPlease upload JPG, PNG or WEBP images only."
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

        if (req.file || uploadedAvatarUrl !== undefined) {
            updateData.avatar = uploadedAvatarUrl;
            updateData.useGooglePhoto = false;
        }

        if (useGooglePhoto !== undefined) {
            updateData.useGooglePhoto = useGooglePhoto;
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
            return res.status(400).json({
                message: "No Google profile picture linked with this account. ❌"
            });
        }

        user.avatar = null;
        user.useGooglePhoto = true;
        await user.save();

        res.json({
            message: "Successfully synced back with your Google profile image! ☀️",
            avatar: null,
            googleAvatar: user.googleAvatar,
            useGooglePhoto: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Identity token signature missing!"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        const googlePhotoUrl = picture || "";

        if (!user) {
            const randomFallbackPassword = crypto.randomBytes(32).toString("hex");
            const safeHashedPassword = await bcrypt.hash(randomFallbackPassword, 10);

            user = await User.create({
                name: name || "Google User",
                email,
                password: safeHashedPassword,
                avatar: null,
                googleAvatar: googlePhotoUrl,
                useGooglePhoto: true,
                isVerified: true,
                profession: "",
                title: ""
            });
        } else {

            if (googlePhotoUrl) {
                user.googleAvatar = googlePhotoUrl;
            }
            if (!user.avatar) {
                user.useGooglePhoto = true;
            }
            await user.save();
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
                googleAvatar: user.googleAvatar || googlePhotoUrl,
                useGooglePhoto: user.useGooglePhoto,
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
        return res.status(500).json({
            message: "Google account structural validation failed."
        });
    }
};

module.exports = {
    signup,
    getUsers,
    verifyEmail,
    login,
    resendVerificationEmail,
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