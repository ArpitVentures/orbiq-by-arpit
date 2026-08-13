import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Rocket, Plane } from "lucide-react";
import { loginUser, registerUser } from "../services/authService";
import { loginQuotes, signupQuotes, verifiedQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/Login.css";
import BackToLanding from "../components/Common/BackToLanding/BackToLanding.jsx";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const showContinueExploring = !location.state?.loggedOut;

    const [isSignUpMode, setIsSignUpMode] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("mode") === "signup";
    });
    const [isLampOn, setIsLampOn] = useState(() => {
        const storedMode = localStorage.getItem("ambientMode");
        return storedMode === "true";
    });

    const [isPulling, setIsPulling] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            toast.loading("Verifying identity vectors with Google...", { id: "oauth-load" });
            const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

            const res = await axios.post(`${serverUrl}/auth/google-login`, {
                token: credentialResponse.credential
            });

            const token = res.data?.token;

            if (token && res.data?.user) {
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("real_valid_token_backup", token);
                sessionStorage.setItem("user", JSON.stringify(res.data.user));

                toast.success("Access Granted via Google! 🫱🏻‍🫲🏻", { id: "oauth-load" });
                handleAuthNavigationRedirect();
            } else {
                toast.error("Security handshake mismatch! ❌", { id: "oauth-load" });
            }
        } catch (error) {
            console.error("Google login crash:", error);
            toast.error(error.response?.data?.message || "Google Authentication Failed. ❌", { id: "oauth-load" });
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("verified") === "true") {
            const randomVerifiedQuote = getRandomQuote(verifiedQuotes);
            toast.success(`${randomVerifiedQuote} 🚀 Let's get to work!`);
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const activeSubtitle = useMemo(() => {
        return isSignUpMode
            ? getRandomQuote(signupQuotes)
            : getRandomQuote(loginQuotes);
    }, [isSignUpMode]);

    const handlePullString = () => {
        setIsPulling(true);
        try {
            const audio = new Audio("/click.mp3");
            audio.volume = 0.4;
            audio.play().catch(() => {});
        } catch (error) {
            console.warn("Audio playback unavailable:", error);
        }

        setTimeout(() => {
            setIsPulling(false);
            const nextMode = !isLampOn;
            setIsLampOn(nextMode);
            localStorage.setItem("ambientMode", String(nextMode));
        }, 150);
    };

    const handleToggleAmbientMode = () => {
        const nextMode = !isLampOn;
        setIsLampOn(nextMode);
        localStorage.setItem("ambientMode", String(nextMode));
    };

    const handleAuthNavigationRedirect = () => {
        if (location.state?.from === "pricing") {
            navigate("/pricing", {
                state: {
                    openPlan: location.state.selectedPlan
                }
            });
            return;
        }

        navigate("/dashboard");
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUpMode) {
                const response = await registerUser({ name, email, password });
                toast.success(response.data?.message || "Verification email sent successfully! 🎉");
                setName(""); setEmail(""); setPassword(""); setIsSignUpMode(false);
            } else {
                const response = await loginUser({ email, password });
                const token = response.data?.token || response.data?.data?.token;
                const userPayload = response.data?.user || response.data?.data?.user;

                if (token && userPayload) {
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("real_valid_token_backup", token);
                    sessionStorage.setItem("user", JSON.stringify(userPayload));

                    toast.success("Access Granted! ");
                    handleAuthNavigationRedirect();
                } else {
                    toast.error("Backend sent an empty token or user node! ❌");
                }
            }
        } catch (error) {
            console.error("Auth verification crash:", error);
            toast.error(error.response?.data?.message || "Authentication failed! ❌");
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className={`auth-container-root ${isLampOn ? "light-mode-active" : "dark-ambient"}`}>

                {showContinueExploring && <BackToLanding />}

                <button
                    className={`ambient-mode-inline-toggle ${isLampOn ? "atmosphere-mode" : "space-mode"}`}
                    onClick={handleToggleAmbientMode}
                    style={{
                        position: "absolute",
                        top: "24px",
                        right: "28px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 16px",
                        borderRadius: "999px",
                        background: isLampOn
                            ? "rgba(56, 189, 248, 0.12)"
                            : "rgba(15, 23, 42, 0.85)",
                        border: isLampOn
                            ? "1px solid rgba(56, 189, 248, 0.3)"
                            : "1px solid rgba(34, 211, 238, 0.25)",
                        color: isLampOn ? "#0284c7" : "#e2e8f0",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        backdropFilter: "blur(10px)",
                        boxShadow: isLampOn
                            ? "0 0 18px rgba(56, 189, 248, 0.2)"
                            : "0 0 20px rgba(34, 211, 238, 0.15)",
                        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                        zIndex: 50
                    }}
                >
                    <span>{isLampOn ? "Atmosphere" : "Space Orbit"}</span>

                    <motion.div
                        animate={{ rotate: isLampOn ? 180 : 0, scale: [0.85, 1.1, 1] }}
                        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: isLampOn
                                ? "rgba(2, 132, 199, 0.15)"
                                : "rgba(34, 211, 238, 0.12)"
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLampOn ? "plane" : "rocket"}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.18 }}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                {isLampOn ? (
                                    <Plane size={16} color="#0284c7" />
                                ) : (
                                    <Rocket size={16} color="#22d3ee" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </button>

                <div className="lamp-illustration-side">
                    <div className="lamp-wrapper">
                        <div className={`cute-lamp ${isLampOn ? "activated" : "dormant"}`}>
                            <div className="lamp-shade">
                                <div className="lamp-eyes">
                                    <span className={`eye left ${isPulling ? "blink" : ""}`}></span>
                                    <span className={`eye right ${isPulling ? "blink" : ""}`}></span>
                                </div>
                                <div className="lamp-smile"></div>
                            </div>
                            <div className="lamp-base"></div>
                        </div>
                        <div className={`pull-chain ${isPulling ? "stretched" : ""}`} onClick={handlePullString}>
                            <div className="chain-line"></div>
                            <div className="chain-bead"></div>
                        </div>
                        {isLampOn && <div className="light-glow-cone"></div>}
                    </div>
                </div>

                <div className="auth-form-side">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignUpMode ? "signup" : "login"}
                            className="form-card-panel"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2>ORBIQ</h2>
                            <h3>{isSignUpMode ? "Create Account" : "Welcome Back"}</h3>
                            <p className="funny-subtitle-text">{activeSubtitle}</p>

                            <div className="oauth-button-container" style={{ margin: "24px 0 12px", display: "flex", flexDirection: "column", width: "100%" }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        toast.error("Google secure login pipeline failed! ❌");
                                    }}
                                    shape="pill"
                                    theme="filled_black"
                                    size="large"
                                    width="350"
                                />

                                <div className="auth-divider" style={{ display: "flex", alignItems: "center", margin: "24px 0 12px", color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}></div>
                                    <span style={{ padding: "0 12px" }}>or credentials</span>
                                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }}></div>
                                </div>
                            </div>

                            <form onSubmit={handleAuthSubmit} className="modern-auth-form">
                                {isSignUpMode && (
                                    <input
                                        type="text"
                                        placeholder="Enter Username"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                )}
                                <input
                                    type="email"
                                    placeholder="Username / Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                {!isSignUpMode && (
                                    <div className="forgot-link-wrapper">
                                        <span onClick={() => navigate("/forgot")}>
                                            Forgot Password? 🤔
                                        </span>
                                    </div>
                                )}

                                <button type="submit" className="action-auth-submit">
                                    {isSignUpMode ? "Register" : "Login"}
                                </button>
                            </form>

                            <div className="auth-footer-toggle">
                                <span>
                                    {isSignUpMode ? "Already a member?" : "Don't have an account yet?"}
                                </span>
                                <button onClick={() => setIsSignUpMode(!isSignUpMode)}>
                                    {isSignUpMode ? "Login" : "Register"}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;