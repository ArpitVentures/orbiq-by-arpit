import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signupQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import { ArrowLeft } from "lucide-react";
import "../styles/Login.css";

function Signup_Backup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [activeSubtitle] = useState(() => getRandomQuote(signupQuotes));

    const handleSignup = (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error(
                "Fill everything. " +
                "You can't skip fields like your 9 AM class! 🕒"
            );
            return;
        }
        toast.success(getRandomQuote(signupQuotes));
        navigate("/login");
    };

    return (
        <div className="auth-container-root">

            <button className="auth-back-home-trigger" onClick={() => navigate("/")}>
                <ArrowLeft size={16}/>
                <span>Back</span>
            </button>

            <div className="form-card-panel">
                <h2>ORBIQ<span className="brand-accent-dot">.</span></h2>
                <h3>Create Account 🚀</h3>
                <p className="funny-subtitle-text">{activeSubtitle}</p>

                <form onSubmit={handleSignup} className="modern-auth-form">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)}
                    />
                    <button type="submit" className="action-auth-submit">
                        Register
                    </button>
                </form>

                <div className="auth-footer-toggle">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="footer-link-highlight">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup_Backup;