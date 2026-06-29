import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Signup() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await api.post("/auth/signup", {
                name,
                email,
                password
            });

            alert(response.data.message);

            console.log(response.data.verificationLink);

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data?.message || "Signup Failed"
            );

        }

    };

    return (
        <div className="login-container">
            <div className="login-box">

                <h1>TaskFlow</h1>

                <h2>Create Account 🚀</h2>

                <p className="subtitle">
                    Create your account to start managing tasks.
                </p>

                <form onSubmit={handleSignup}>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="submit">
                        Create Account
                    </button>

                </form>

                <p>
                    Already have an account?
                    <Link to="/"> Login</Link>
                </p>

            </div>
        </div>
    );
}

export default Signup;