import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { resetPassword } from "../services/authService";
import BackToLanding from "../components/Common/BackToLanding/BackToLanding.jsx";
import { getRandomQuote, passwordMismatchQuotes } from "../utils/funnyQuotes.js";

function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validations = {
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /\d/.test(newPassword),
        special: /[!@#$%^&*()_+=\-{}[\];':"\\|,.<>/?]/.test(newPassword)
    };

    const validCount = Object.values(validations).filter(Boolean).length;
    const isAllValid = validCount === 5;
    const isMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

    const getStrengthMeta = () => {
        if (!newPassword) return { score: 0, label: "", color: "#334155" };
        if (validCount <= 2) return { score: 1, label: "Weak", color: "#f87171" };
        if (validCount === 3) return { score: 2, label: "Medium", color: "#fbbf24" };
        if (validCount === 4) return { score: 3, label: "Strong", color: "#60a5fa" };
        return { score: 4, label: "Very Strong", color: "#4ade80" };
    };

    const strength = getStrengthMeta();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAllValid) {
            toast.error("Please satisfy all password complexity requirements. 🔐");
            return;
        }

        if (!isMatch) {
            const randomMismatchQuote = getRandomQuote(passwordMismatchQuotes);
            toast.error(randomMismatchQuote, {
                duration: 4000
            });
            return;
        }

        try {
            setIsLoading(true);
            await resetPassword(token, { newPassword });

            setIsSuccess(true);
            toast.success("Password updated successfully! 🎉");

        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error(error.response?.data?.message || "Invalid or expired reset token.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#090b0e",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative"
        }}>
            <BackToLanding />

            <motion.div
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    padding: "42px 36px",
                    borderRadius: "24px",
                    backgroundColor: "#12161a",
                    border: "1px solid #1e293b",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                    textAlign: "left",
                    position: "relative",
                    zIndex: 10
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <h2 style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    background: "linear-gradient(to right, #06b6d4, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "5px"
                }}>ORBIQ</h2>

                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="reset-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <h3 style={{ fontSize: "20px", color: "#ffffff", marginBottom: "8px", fontWeight: "700" }}>
                                Set New Password 🛠️
                            </h3>

                            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "22px", lineHeight: "1.5" }}>
                                Choose a strong password to secure your ORBIQ workspace.
                            </p>

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "15px 48px 15px 18px",
                                            borderRadius: "14px",
                                            fontSize: "14.5px",
                                            background: "#181d24",
                                            border: "1px solid #2d3748",
                                            color: "#ffffff",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute", right: "16px", top: "50%",
                                            transform: "translateY(-50%)", background: "none",
                                            border: "none", color: "#64748b", cursor: "pointer"
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "15px 48px 15px 18px",
                                            borderRadius: "14px",
                                            fontSize: "14.5px",
                                            background: "#181d24",
                                            border: "1px solid #2d3748",
                                            color: "#ffffff",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: "absolute", right: "16px", top: "50%",
                                            transform: "translateY(-50%)", background: "none",
                                            border: "none", color: "#64748b", cursor: "pointer"
                                        }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {newPassword.length > 0 && (
                                    <div style={{ margin: "2px 0 4px 0" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Strength</span>
                                            <span style={{ fontSize: "11px", color: strength.color, fontWeight: "700" }}>{strength.label}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "6px", height: "4px" }}>
                                            {[1, 2, 3, 4].map((step) => (
                                                <div
                                                    key={step}
                                                    style={{
                                                        flex: 1,
                                                        height: "100%",
                                                        borderRadius: "2px",
                                                        background: step <= strength.score ? strength.color : "#233045",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    background: "rgba(255, 255, 255, 0.02)",
                                    border: "1px solid rgba(255, 255, 255, 0.06)",
                                    borderRadius: "14px",
                                    padding: "14px 16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    fontSize: "12px",
                                    marginTop: "2px"
                                }}>
                                    <RequirementItem valid={validations.length} label="8+ Characters" />
                                    <RequirementItem valid={validations.uppercase} label="Uppercase (A-Z)" />
                                    <RequirementItem valid={validations.lowercase} label="Lowercase (a-z)" />
                                    <RequirementItem valid={validations.number} label="Number (0-9)" />
                                    <RequirementItem valid={validations.special} label="At least one special character" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        padding: "15px",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontSize: "15px",
                                        color: "#ffffff",
                                        background: "linear-gradient(to right, #06b6d4, #7c3aed)",
                                        cursor: isLoading ? "not-allowed" : "pointer",
                                        fontWeight: "700",
                                        opacity: isLoading ? 0.6 : 1,
                                        marginTop: "8px",
                                        boxShadow: "0 10px 25px rgba(6, 182, 212, 0.25)",
                                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                    }}
                                >
                                    {isLoading ? "Updating Engine..." : "Update Password →"}
                                </button>
                            </form>
                        </motion.div>
                    ) : (

                        <motion.div
                            key="success-screen"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: "center", paddingTop: "10px" }}
                        >
                            <div style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                background: "rgba(34, 197, 94, 0.1)",
                                border: "1px solid rgba(34, 197, 94, 0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px auto",
                                color: "#22c55e"
                            }}>
                                <ShieldCheck size={32} />
                            </div>

                            <h3 style={{ fontSize: "22px", color: "#ffffff", marginBottom: "10px", fontWeight: "700" }}>
                                Password Updated! 🎉
                            </h3>

                            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6", marginBottom: "28px" }}>
                                Your password has been changed successfully. You can now log in with your new credentials.
                            </p>

                            <button
                                onClick={() => navigate("/login")}
                                style={{
                                    width: "100%",
                                    padding: "15px",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontSize: "15px",
                                    color: "#ffffff",
                                    background: "linear-gradient(to right, #06b6d4, #7c3aed)",
                                    cursor: "pointer",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px"
                                }}
                            >
                                Proceed to Login <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function RequirementItem({ valid, label }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: valid ? "#4ade80" : "#64748b",
            fontWeight: valid ? "600" : "400",
            transition: "all 0.25s ease"
        }}>
            {valid ? <CheckCircle2 size={14} color="#22c55e" /> : <XCircle size={14} color="#64748b" />}
            <span>{label}</span>
        </div>
    );
}

export default ResetPassword;