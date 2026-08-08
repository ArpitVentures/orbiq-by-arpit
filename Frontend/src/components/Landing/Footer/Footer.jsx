import React from "react";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import "./Footer.css";

function Footer() {
    return (
        <footer className="landing-footer">
            <div className="footer-glow-aura"></div>

            <div className="footer-container">
                <div className="footer-main-grid">

                    <div className="footer-brand-segment">
                        <div className="footer-logo-area">
                            <h2 className="footer-logo">ORBIQ</h2>
                            <span className="footer-version">Version 1.0</span>
                        </div>
                        <p className="footer-description">
                            Plan. Collaborate. <br />
                            Track everything.  <br />
                            All in one workspace.
                        </p>
                        <div className="footer-social-links">
                            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                                <FaGithub />
                            </a>
                            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                                <FaXTwitter />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className="footer-links-column">
                        <h3>Product</h3>
                        <a href="#features">Features</a>
                        <a href="#pricing">Pricing</a>
                        <span className="footer-disabled-link">
                            Horizon <span className="footer-beta-tag">BETA</span>
                        </span>
                    </div>

                    <div className="footer-links-column">
                        <h3>Contact</h3>
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=geniusbillionairearpit@gmail.com"
                            target="_blank"
                            rel="noreferrer"
                            className="footer-email-link"
                            title="Compose Email on Gmail"
                        >
                            geniusbillionairearpit@gmail.com
                        </a>
                    </div>

                </div>

                <div className="footer-divider-line"></div>

                <div className="footer-bottom-bar">
                    <p className="copyright-text">
                        © 2026 ORBIQ. All rights reserved.
                    </p>

                    <p className="built-with-tag">
                        Built with <span className="tech-stack-highlight">React • Express • MongoDB</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;