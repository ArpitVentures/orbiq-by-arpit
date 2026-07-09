import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signupQuotes, getRandomQuote } from "../utils/funnyQuotes.js";
import "../styles/Login.css";

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [activeSubtitle, setActiveSubtitle] = useState("");

    useEffect(() => {
        setActiveSubtitle(getRandomQuote(signupQuotes));
    }, []);

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
        <div className="login-page">
            <div className="login-card">
                <h2>TaskFlow</h2>
                <h3>Create Account 🚀</h3>
                <p className="funny-subtitle">{activeSubtitle}</p>

                <form onSubmit={handleSignup} className="login-form">
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
                    <button type="submit" className="login-btn">
                        Register
                    </button>
                </form>

                <div className="card-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;