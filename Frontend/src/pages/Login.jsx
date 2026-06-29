import { useState } from "react";
import { useNavigate } from
"react-router-dom";
import api from "../services/api";
import {Link} from "react-router-dom";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);

            alert("Login Successful!");

            navigate("/dashboard");
        } catch (error) {
            alert(
                error.response?.data?.message || "Login Failed"
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">

                <h1>TaskFlow</h1>

                <h2>Welcome Back 👋🏻</h2>

                <p className="subtitle">
                    Login to continue managing your tasks.
                </p>

                <form onSubmit={handleLogin}>

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

                    <p className= "forgot-password">
                        <a href= "#">Forgot Password?</a>
                    </p>


                    <button type="submit">
                        Login
                    </button>

                </form>

                <p>
                    Don't have an account?
                    <Link to="/signup"> Sign Up</Link>
                </p>

            </div>
        </div>
    );

}

export default Login;