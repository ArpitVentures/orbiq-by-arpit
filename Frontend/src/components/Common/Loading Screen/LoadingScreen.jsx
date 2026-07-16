import "./LoadingScreen.css";

function LoadingScreen({
                           progress = 0,
                           message = "Preparing your workspace...",
                           mode = "free"
                       }) {

    const currentStep = Math.min(
        Math.floor(progress / 25),
        3
    );

    const checklist =
        mode === "payment"
            ? [
                "Initializing Workspace",
                "Encrypting Transaction",
                "Connecting Razorpay",
                "Redirecting Securely"
            ]
            : [
                "Creating Workspace",
                "Applying Preferences",
                "Setting Up Dashboard",
                "Almost Ready"
            ];

    return (
        <div className="loading-screen">
            <div className="loading-container">
                <h1 className="loading-logo">ORBIQ</h1>

                <div className="progress-wrapper">

                    <div
                        className="progress-ring"
                        style={{
                            background: `conic-gradient(
                                #22d3ee ${progress * 3.6}deg,
                                rgba(255,255,255,.08) 0deg
                            )`
                        }}
                    >
                        <div className="progress-content">
                            <h2>{progress}%</h2>
                            <span>
                                {mode === "payment"
                                    ? "Secure Payment"
                                    : "Workspace Setup"}
                            </span>

                        </div>
                    </div>
                </div>

                <div className="loading-heading">
                    <h2>
                        {mode === "payment"
                            ? "Preparing Secure Checkout"
                            : "Preparing Your Workspace"}
                    </h2>
                </div>

                <div className="loading-steps">
                    {checklist.map((step, index) => (
                        <div
                            key={step}
                            className={
                                index < currentStep
                                    ? "loading-step completed"
                                    : index === currentStep
                                        ? "loading-step active"
                                        : "loading-step pending"
                            }
                        >
                            <span className="step-icon">
                                   {index < currentStep ? "✓" : "○"}
                            </span>

                            <span>{step}</span>
                        </div>
                    ))}
                </div>

                <p className="loading-message">
                    {message}
                </p>

                <p className="loading-subtext">
                    Please don't close this window.
                </p>

                <span className="loading-version">
                    Powered by ORBIQ
                </span>
            </div>
        </div>
    );
}

export default LoadingScreen;