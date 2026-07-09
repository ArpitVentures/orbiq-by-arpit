import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser } from "../services/authService";
import { loginQuotes, signupQuotes, verifiedQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [isLampOn, setIsLampOn] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("verified") === "true") {
            const randomVerifiedQuote = getRandomQuote(verifiedQuotes);
            toast.success(`${randomVerifiedQuote} 🚀 Turn on the lamp to login.`);
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        setActiveSubtitle(
            isSignUpMode ? getRandomQuote(signupQuotes) : getRandomQuote(loginQuotes)
        );
    }, [isSignUpMode]);

    const handlePullString = () => {
        setIsPulling(true);
        try {
            const audio = new Audio("/click.mp3");
            audio.volume = 0.4;
            audio.play().catch(() => {});
        } catch (e) {}

        setTimeout(() => {
            setIsPulling(false);
            setIsLampOn(!isLampOn);
        }, 150);
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if (!isLampOn) {
            toast.error("It's too dark in here! Turn on the lamp so we can actually see your brilliance. 💡🌟");
            return;
        }

        try {
            if (isSignUpMode) {
                const response = await registerUser({ name, email, password });
                toast.success(response.data?.message || "Verification email sent successfully!" +
                                                                 "🎉 Check your mailbox.");

                setName("");
                setEmail("");
                setPassword("");
                setIsSignUpMode(false);
            } else {
                const response = await loginUser({ email, password });
                const token = response.data?.token || response.data?.data?.token;

                if (token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify({
                        name: response.data?.user?.name || response.data?.data?.user?.name || "Arpit"
                    }));
                    toast.success("Access Granted! 🚀");
                    navigate("/dashboard");
                } else {
                    toast.error("Backend sent an empty token node! ❌");
                }
            }
        } catch (error) {
            console.error("Auth verification crash:", error);
            toast.error(error.response?.data?.message || "Authentication failed! Check connections. ❌");
        }
    };

    return (
        <div className={`auth-container-root ${isLampOn ? "light-mode-active" : "dark-ambient"}`}>

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

                    <div
                        className={`pull-chain ${isPulling ? "stretched" : ""}`}
                        onClick={handlePullString}
                    >
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
                        <h2>TaskFlow</h2>
                        <h3>{isSignUpMode ? "Create Account" : "Welcome Back"}</h3>
                        <p className="funny-subtitle-text">{activeSubtitle}</p>

                        <form onSubmit={handleAuthSubmit} className="modern-auth-form">
                            {isSignUpMode && (
                                <input
                                    type="text"
                                    placeholder="Enter Username"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)}
                                    required
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Username / Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)}
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
    );
}

export default Login;