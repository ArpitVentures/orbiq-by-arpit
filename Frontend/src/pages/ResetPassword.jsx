console.log("🔥 RESET PASSWORD CONTROLLER RUNNING 🔥");
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { resetPassword } from "../services/authService";
import { useParams } from "react-router-dom";
import BackToLanding from "../components/Common/BackToLanding/BackToLanding.jsx";

function ResetPassword() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    console.log("Frontend Token:", token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit Clicked");

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (!/[A-Z]/.test(newPassword)) {
            toast.error("Add at least one uppercase letter (A-Z).");
            return;
        }

        if (!/[a-z]/.test(newPassword)) {
            toast.error("Add at least one lowercase letter (a-z).");
            return;
        }

        if (!/\d/.test(newPassword)) {
            toast.error("Add at least one number (0-9).");
            return;
        }

        if (!/[@$!%*?&]/.test(newPassword)) {
            toast.error("Add at least one special character (@$!%*?&).");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords mismatch! Both inputs should be twins. 🛑");
            return;
        }
        try {
            setIsLoading(true);

            const response = await resetPassword(token, {
                newPassword
            });

            console.log("Response:", response);

            toast.success("Password updated successfully! 🎉 + Please login with your new password.😊");

            navigate("/login");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Password update failed."
            );

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
            fontFamily: "sans-serif",
            position: "relative" // Ensured relative positioning for absolute child placements
        }}>
            {/* 🎯 Added BackToLanding inside root div */}
            <BackToLanding />

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

                <h3 style={{ fontSize: "20px", color: "#ffffff", marginBottom: "8px" }}>
                    Set New Password 🛠️</h3>

                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "25px", lineHeight: "1.5" }}>
                    Type a new key. Try not to forget this one within 5 minutes.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "15px 20px",
                            borderRadius: "14px",
                            fontSize: "14.5px",
                            background: "#181d24",
                            border: "1px solid #2d3748",
                            color: "#ffffff",
                            outline: "none"
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "15px 20px",
                            borderRadius: "14px",
                            fontSize: "14.5px",
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
                            fontWeight: "600",
                            marginTop: "10px"
                        }}
                    >
                        {isLoading ? "Updating Engine..." : "Update Password"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default ResetPassword;