import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { forgotPasswordQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import { forgotPassword } from "../services/authService.js";
import BackToLanding from "../components/Common/BackToLanding/BackToLanding.jsx";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState("");

    useEffect(() => {
        setActiveSubtitle(getRandomQuote(forgotPasswordQuotes));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter a valid email address. 🧠");
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword({ email: email.trim() });

            setIsSubmitted(true);
            toast.success("Password recovery link dispatched! Check your inbox. 📬");

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "User profile not found in database! ❌";
            toast.error(msg);
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
                    maxWidth: "440px",
                    padding: "42px 36px",
                    borderRadius: "24px",
                    backgroundColor: "#12161a",
                    border: "1px solid #1e293b",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                    textAlign: "left",
                    position: "relative",
                    zIndex: 10
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <h2 style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        background: "linear-gradient(to right, #06b6d4, #7c3aed)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        margin: 0
                    }}>ORBIQ</h2>
                </div>

                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="request-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <h3 style={{ fontSize: "20px", color: "#ffffff", marginBottom: "8px", fontWeight: "700" }}>
                                Recover Password 🔑
                            </h3>

                            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "24px", lineHeight: "1.6" }}>
                                {activeSubtitle || "Enter your registered email address. We'll send you a secure link to reset your password."}
                            </p>

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="email"
                                        placeholder="Enter Registered Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "15px 18px",
                                            borderRadius: "14px",
                                            fontSize: "14.5px",
                                            letterSpacing: "0.3px",
                                            background: "#181d24",
                                            border: "1px solid #2d3748",
                                            color: "#ffffff",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }}
                                    />
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
                                        opacity: isLoading ? 0.75 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        transition: "all 0.25s ease"
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" /> Dispatching Link...
                                        </>
                                    ) : (
                                        "Send Reset Link →"
                                    )}
                                </button>
                            </form>

                            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
                                <button
                                    onClick={() => navigate("/login")}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#94a3b8",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "13.5px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <ArrowLeft size={14} /> Remembered your password? Back to Login
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-confirmation"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: "center", paddingTop: "10px" }}
                        >
                            <div style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                background: "rgba(34, 211, 238, 0.1)",
                                border: "1px solid rgba(34, 211, 238, 0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px auto",
                                color: "#22d3ee"
                            }}>
                                <Mail size={30} />
                            </div>

                            <h3 style={{ fontSize: "22px", color: "#ffffff", marginBottom: "10px", fontWeight: "700" }}>
                                Check Your Email 📬
                            </h3>

                            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6", marginBottom: "24px" }}>
                                We've sent a secure password reset link to <br />
                                <strong style={{ color: "#22d3ee" }}>{email}</strong>. Please check your inbox and spam folder.
                            </p>

                            <div style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "14px",
                                padding: "14px 16px",
                                fontSize: "12.5px",
                                color: "#64748b",
                                marginBottom: "28px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}>
                                <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                                <span>The link is valid for 60 minutes for security purposes.</span>
                            </div>

                            <button
                                onClick={() => navigate("/login")}
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    color: "#ffffff",
                                    background: "rgba(255,255,255,0.05)",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                Return to Login
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;