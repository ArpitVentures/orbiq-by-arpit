import "./../Styles/AuthBackground.css";

function AuthBackground({ children }) {
    return (
        <div className="auth-background">

            <div className="bg-glow bg-glow-one"></div>

            <div className="bg-glow bg-glow-two"></div>

            <div className="bg-grid"></div>

            <div className="auth-background-content">
                {children}
            </div>

        </div>
    );
}

export default AuthBackground;