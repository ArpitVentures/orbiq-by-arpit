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
    FaArrowLeft
} from "react-icons/fa";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSocialClick = (platform, link) => {
        if (link && link.trim() !== "") {
            window.open(link, "_blank");
        } else {
            toast.error(`${platform} profile not added yet! 🤐 Go to 'Edit Profile'.`);
        }
    };

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
                    <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600" }}>Profile Settings</span>
                </div>

                <div className="profile-page">
                    <div className="profile-card">
                        <div
                            className="profile-img-container"
                            style={{ position: "relative" }}
                        >
                            <img
                                src={
                                    user?.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        user?.name || "User"
                                    )}&background=2563eb&color=fff&size=200`
                                }
                                alt="Profile"
                                className="profile-img"
                            />
                        </div>

                        <div className="avatar-action-controls" style={{ display: "flex", gap: "10px", marginTop: "12px", justifyContent: "center" }}>
                            {user?.googleAvatar && user.avatar !== user.googleAvatar && (
                                <button
                                    className="btn-revert-google"
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem("token");
                                            const response = await api.post("/auth/revert-avatar", {}, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            setUser(prev => ({ ...prev, avatar: response.data.avatar }));
                                            toast.success("Synced back with your Google photo! ☀️");
                                        } catch (e) {
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

                        <h2 style={{ marginTop: "16px" }}>{user?.name || "Loading..."}</h2>

                        <div className="role" style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" }}>
                            {user?.profession && user.profession !== "Student" ? (
                                <span style={{ fontSize: "16px", color: "#10b981", fontWeight: "500" }}>
                                    🎓 {user.profession}</span>
                            ) : null}

                            {user?.title && user.title !== "Frontend Developer" ? (
                                <span style={{ fontSize: "14px", color: "#64748b" }}>💻 {user.title}</span>
                            ) : null}

                            {(!user?.profession || user.profession === "Student") &&
                                (!user?.title || user.title === "Frontend Developer") && (
                                    <span style={{
                                        opacity: 0.6,
                                        fontSize: "13px",
                                        fontStyle: "italic",
                                        color: "#f59e0b",
                                        background: "rgba(245, 158, 11, 0.1)",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px dashed rgba(245, 158, 11, 0.3)",
                                        maxWidth: "80%",
                                        marginTop: "5px"
                                    }}>
                                 "Help us complete your profile before recruiters start asking questions. 😄"
                            </span>
                                )}
                        </div>

                        <button
                            className="edit-btn"
                            onClick={() => setShowModal(true)}
                        >
                            <FaUserEdit /> Edit Profile
                        </button>
                    </div>

                    <div className="profile-info">
                        <h3>Personal Information</h3>

                        <div className="info-box">
                            <FaEnvelope />
                            <span>{user?.email}</span>
                        </div>

                        <div className="info-box">
                            <span>📞</span>
                            <span className={user?.phone ? "data-text" : "placeholder-text"}>
                                  {user?.phone || "Add your phone number to stay reachable 📱"}
                            </span>
                        </div>

                        <div className="info-box">
                            <FaUniversity />
                            <span className={user?.university ? "data-text" : "placeholder-text"}>
                                  {user?.university || "Add your university to pin your campus 🏛️"}
                            </span>
                        </div>

                        <div className="info-box">
                            <FaLaptopCode />
                            <span className={user?.course ? "data-text" : "placeholder-text"}>
                                  {user?.course || "What's your major? Let us know what you're grinding for 📚"}
                            </span>
                        </div>

                        <h3>Connect</h3>

                        <div className="social-links">
                            <button
                                className={`social-btn github ${user?.github ? "connected-cyan" : "faded-disabled"}`}
                                onClick={() => handleSocialClick("GitHub", user?.github)}
                            >
                                <FaGithub /> GitHub {user?.github ? "⚡" : "(Not Connected)"}
                            </button>

                            <button
                                className={`social-btn linkedin ${user?.linkedin ? "connected-cyan" : "faded-disabled"}`}
                                onClick={() => handleSocialClick("LinkedIn", user?.linkedin)}
                            >
                                <FaLinkedin /> LinkedIn {user?.linkedin ? "⚡" : "(Not Connected)"}
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