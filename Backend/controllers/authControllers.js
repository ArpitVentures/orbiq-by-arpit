import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./../styles/Profile.css";
import {
    FaGithub,
    FaLinkedin,
    FaUserEdit,
    FaEnvelope,
    FaUniversity,
    FaLaptopCode,
    FaArrowLeft,
    FaUserTie,
    FaBriefcase
} from "react-icons/fa";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchProfile = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await api.get("/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            try {
                const token = sessionStorage.getItem("token");

                const response = await api.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!cancelled) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleSocialClick = (platform, link) => {
        if (link && link.trim() !== "") {
            window.open(link, "_blank");
        } else {
            toast.error(`${platform} link not added yet! 🤐 Go to 'Edit Crew Profile'.`);
        }
    };

    const userNameDisplay = user?.name || "Crew Member";

    const fallbackAvatar =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userNameDisplay)}&background=2563eb&color=fff&size=200`;

    const userAvatar =
        user?.avatar ||
        user?.googleAvatar ||
        fallbackAvatar;

    console.log("PROFILE AVATAR:", userAvatar);
    console.log("USER AVATAR:", user?.avatar);
    console.log("GOOGLE AVATAR:", user?.googleAvatar);

    if (isLoading) {
        return (
            <div className="profile-page-loading">
                Loading Crew Profile...
            </div>
        );
    }

    return (
        <>
            <div className="profile-page-outer-container" style={{ padding: "32px 48px", width: "100%", boxSizing: "border-box" }}>

                <div className="breadcrumb-nav-header" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "32px"
                }}>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#64748b",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            padding: "0",
                            transition: "color 0.2s"
                        }}
                        onMouseEnter={(e) =>
                            e.target.style.color = "#06b6d4"}
                        onMouseLeave={(e) =>
                            e.target.style.color = "#64748b"}
                    >
                        <FaArrowLeft style={{ fontSize: "12px" }} /> Dashboard
                    </button>
                    <span style={{ color: "#334155", fontSize: "14px" }}>/</span>
                    <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600" }}>Crew Profile</span>
                </div>

                <div className="profile-page">
                    <div className="profile-card">
                        <div
                            className="profile-img-container"
                            style={{ position: "relative" }}
                        >
                            <img
                                src={userAvatar}
                                alt="Crew Avatar"
                                className="profile-img"
                                onError={(e) => {
                                    console.error("❌ AVATAR FAILED:", e.currentTarget.src);
                                    if (e.currentTarget.dataset.fallbackApplied === "true") return;

                                    e.currentTarget.dataset.fallbackApplied = "true";
                                    e.currentTarget.src = fallbackAvatar;
                                }}
                            />
                        </div>

                        <div className="avatar-action-controls" style={{ display: "flex", gap: "10px", marginTop: "12px", justifyContent: "center" }}>
                            {user?.googleAvatar && user.avatar !== user.googleAvatar && (
                                <button
                                    className="btn-revert-google"
                                    onClick={async () => {
                                        try {
                                            const token = sessionStorage.getItem("token");
                                            const response = await api.post("/auth/revert-avatar", {}, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            setUser(prev => ({ ...prev, avatar: response.data.avatar }));
                                            toast.success("Synced back with your Google avatar! ☀️");
                                        } catch {
                                            toast.error("Failed to reset avatar frame.");
                                        }
                                    }}
                                    style={{
                                        background: "transparent",
                                        color: "#06b6d4",
                                        border: "1px solid #06b6d4",
                                        borderRadius: "8px",
                                        padding: "6px 12px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        fontWeight: "600"
                                    }}
                                >
                                    Use Google Photo
                                </button>
                            )}
                        </div>

                        <h2 style={{ marginTop: "16px" }}>{user?.name || "Crew Member"}</h2>

                        <div className="role" style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" }}>
                            {user?.profession && (
                                <span style={{ fontSize: "16px", color: "#10b981", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FaUserTie size={15} />
                                    {user.profession}
                                </span>
                            )}

                            {user?.title && (
                                <span style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FaBriefcase size={13} />
                                    {user.title}
                                </span>
                            )}

                            {(!user?.phone || !user?.university || !user?.course) && (
                                <div
                                    className="profile-completion-notice-card"
                                    style={{
                                        background: "rgba(245, 158, 11, 0.05)",
                                        border: "1px dashed rgba(245, 158, 11, 0.25)",
                                        borderRadius: "12px",
                                        padding: "12px 16px",
                                        color: "#fbbf24",
                                        fontSize: "12px",
                                        fontWeight: "400",
                                        fontStyle: "italic",
                                        opacity: 0.75,
                                        backdropFilter: "blur(4px)",
                                        marginTop: "14px",
                                        maxWidth: "88%",
                                        lineHeight: "1.5",
                                        letterSpacing: "0.2px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    🚀 Complete your crew profile to unlock the full ORBIQ workspace experience.
                                </div>
                            )}
                        </div>

                        <button
                            className="edit-btn"
                            onClick={() => setShowModal(true)}
                            style={{ marginTop: "20px" }}
                        >
                            <FaUserEdit /> Edit Crew Profile
                        </button>
                    </div>

                    <div className="profile-info">
                        <h3>👨‍🚀 Crew Identity</h3>

                        <div className="info-box">
                            <FaEnvelope />
                            <span>{user?.email}</span>
                        </div>

                        <div className="info-box">
                            <span>📞</span>
                            <span className={user?.phone ? "data-text" : "placeholder-text"}>
                                {user?.phone || "Add comms line (phone number) 📱"}
                            </span>
                        </div>

                        <h3>🎓 Mission Background</h3>

                        <div className="info-box">
                            <FaUniversity />
                            <span className={user?.university ? "data-text" : "placeholder-text"}>
                                {user?.university || "Add mission base / university 🏛️"}
                            </span>
                        </div>

                        <div className="info-box">
                            <FaLaptopCode />
                            <span className={user?.course ? "data-text" : "placeholder-text"}>
                                {user?.course || "Add specialization / course major 📚"}
                            </span>
                        </div>

                        <h3>🌍 Mission Network</h3>

                        <div className="social-links" style={{ display: "flex", gap: "16px", marginTop: "16px" }}>

                            <button
                                className={`social-btn github ${user?.github ? "connected-cyan" : "faded-disabled"}`}
                                onClick={() => handleSocialClick("GitHub", user?.github)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "14px 20px",
                                    borderRadius: "14px",
                                    width: "100%",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600" }}>
                                    <FaGithub style={{ fontSize: "20px" }} />
                                    <span>GitHub Profile</span>
                                </div>

                                {user?.github ? (
                                    <span style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        letterSpacing: "0.5px",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        background: "rgba(34, 197, 94, 0.15)",
                                        color: "#4ade80",
                                        border: "1px solid rgba(34, 197, 94, 0.4)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}>
                                        🟢 LINKED
                                    </span>
                                ) : (
                                    <span style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        letterSpacing: "0.5px",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        background: "rgba(245, 158, 11, 0.12)",
                                        color: "#fbbf24",
                                        border: "1px solid rgba(245, 158, 11, 0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}>
                                        🟠 SETUP REQUIRED
                                    </span>
                                )}
                            </button>

                            <button
                                className={`social-btn linkedin ${user?.linkedin ? "connected-cyan" : "faded-disabled"}`}
                                onClick={() => handleSocialClick("LinkedIn", user?.linkedin)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "14px 20px",
                                    borderRadius: "14px",
                                    width: "100%",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600" }}>
                                    <FaLinkedin style={{ fontSize: "20px" }} />
                                    <span>LinkedIn Profile</span>
                                </div>

                                {user?.linkedin ? (
                                    <span style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        letterSpacing: "0.5px",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        background: "rgba(34, 197, 94, 0.15)",
                                        color: "#4ade80",
                                        border: "1px solid rgba(34, 197, 94, 0.4)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}>
                                        🟢 LINKED
                                    </span>
                                ) : (
                                    <span style={{
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        letterSpacing: "0.5px",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        background: "rgba(245, 158, 11, 0.12)",
                                        color: "#fbbf24",
                                        border: "1px solid rgba(245, 158, 11, 0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}>
                                        🟠 SETUP REQUIRED
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <EditProfileModal
                    user={user}
                    onClose={() => setShowModal(false)}
                    refreshProfile={fetchProfile}
                />
            )}
        </>
    );
}

export default Profile;