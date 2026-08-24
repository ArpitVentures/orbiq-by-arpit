import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="navbar-container">

                <Link to="/" className="logo-area">

                    <img
                        src="/assets/orbiq-logo.png"
                        alt="ORBIQ — Productivity OS"
                        className="navbar-brand-logo"
                    />

                </Link>

                <div className="nav-center">

                    <a href="#features">
                        Features
                    </a>

                    <a href="#pricing">
                        Pricing
                    </a>

                    <a href="#faq">
                        FAQ
                    </a>

                </div>

                <div className="nav-links">

                    <Link to="/login">
                        Login
                    </Link>

                    <Link
                        className="signup-btn"
                        to="/login?mode=signup"
                        state={{
                            cameFromLanding: true,
                            scrollTo: "hero"
                        }}
                    >
                        Create Workspace

                        <ArrowRight size={16} />

                    </Link>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;