import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import api from "../services/api";
import { toast } from "react-hot-toast";
import "./../styles/Profile.css";
import {
    FaGithub,
    FaLinkedin,
    FaUserEdit,
    FaEnvelope,
    FaUniversity,
    FaLaptopCode,
} from "react-icons/fa";

function Profile() {
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
            <div className="profile-page">
                <div className="profile-card">
                    <img
                        src={
                            user?.avatar
                                ? user.avatar
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user?.name || "User"
                                )}&background=2563eb&color=fff&size=200`
                        }
                        alt="Profile"
                        className="profile-img"
                    />

                    <h2>{user?.name || "Loading..."}</h2>


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