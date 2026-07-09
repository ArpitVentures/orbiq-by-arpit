import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { forgotPasswordQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import { forgotPassword } from "../services/authService.js";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState("");

    useEffect(() => {
        setActiveSubtitle(getRandomQuote(forgotPasswordQuotes));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Don't leave it blank like your mind in exam! 🧠");
            return;
        }

        setIsLoading(true);
        try {

            await forgotPassword({ email: email.trim() });

            toast.success("Magic portal dispatched! Check your mailbox. 📬");
            navigate("/login");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "User node not found! ❌";
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
            overflow: "hidden"
        }}>
            <motion.div
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    padding: "45px",
                    borderRadius: "24px",
                    backgroundColor: "#12161a",
                    border: "1px solid #1e293b",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    textAlign: "left"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    background: "linear-gradient(to right, #06b6d4, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "5px"
                }}>TaskFlow</h2>

                <h3 style={{ fontSize: "20px", color: "#ffffff", marginBottom: "8px" }}>Recover Password 🔑</h3>

                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "25px", lineHeight: "1.5" }}>
                    {activeSubtitle}
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input
                        type="email"
                        placeholder="Enter Registered Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "15px 20px",
                            borderRadius: "14px",
                            fontSize: "14.5px",
                            letterSpacing: "0.3px",
                            background: "#181d24",
                            border: "1px solid #2d3748",
                            color: "#ffffff",
                            outline: "none"
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: "14px",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "15px",
                            color: "#ffffff",
                            background: "linear-gradient(to right, #06b6d4, #7c3aed)",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        {isLoading ? "Sending Magic Link..." : "Send Reset Link"}
                    </button>

                </form>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#06b6d4",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "13.5px"
                        }}
                    >
                        Back to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;