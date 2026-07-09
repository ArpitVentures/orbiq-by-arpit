import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { resetPassword } from "../services/authService.js";
import "../styles/Login.css";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("Make password strong! At least 6 elements required. 🔐");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords mismatch! Both inputs should be twins. 🛑");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, { password: newPassword });

            toast.success("Password updated! Access granted. 🎉");
            navigate("/login");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Token session expired! ❌";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page dark-ambient">
            <motion.div
                className="login-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ marginLeft: "0" }}
            >
                <h2>TaskFlow</h2>
                <h3>Set New Password 🛠️</h3>
                <p className="funny-subtitle">
                    Type a new key. Try not to forget this one within 5 minutes.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="submit-auth-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating Engine..." : "Update Password"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default ResetPassword;