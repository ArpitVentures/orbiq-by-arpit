import { useState, useEffect } from "react";
import "./../styles/EditProfileModal.css";
import api from "../services/api";
import { toast } from "react-hot-toast";

const quotes = [
    "✨ Time for a glow-up? Update your profile and show the world your new self!",
    "🕵️ Feeling like a new person? Update your details before someone asks who you are.",
    "🚀 Small profile update. Huge main character energy.",
    "💻 Every developer deserves a profile that stands out.",
    "📚 New semester? New skills? Time to refresh your profile.",
    "😎 Your profile deserves as much love as your code."
];

function EditProfileModal({ onClose, user, refreshProfile }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        university: "",
        course: "",
        github: "",
        linkedin: "",
        profession: "",
        title: ""
    });

    const [randomQuote] = useState(() =>
        quotes[Math.floor(Math.random() * quotes.length)]);

    useEffect(() => {
        if(user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                university: user.university || "",
                course: user.course || "",
                github: user.github || "",
                linkedin: user.linkedin || "",
                profession: user.profession || "",
                title: user.title || ""
            });
        }
    }, [user]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault(); // Stop form defaults
        console.log("Saving Form Data: ", formData);

        try {
            const token = localStorage.getItem("token");

            await api.put(
                "/auth/profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await refreshProfile();
            toast.success("Profile Updated Successfully! 🎉");
            onClose();

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Failed to update profile ❌");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="edit-modal">

                <button className="close-btn" onClick={onClose}>
                    ✖
                </button>

                <h2>Edit Profile</h2>

                <p className="edit-message">
                    {randomQuote}
                </p>

                <div className="avatar-section">
                    <img
                        src={
                            user?.avatar
                                ? user.avatar
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    formData.name || user?.name || "User"
                                )}&background=2563eb&color=fff&size=200`
                        }
                        alt="Profile Avatar"
                    />
                    <button type="button">Change Photo</button>
                </div>

                <form className="modal-segmented-form" onSubmit={handleSave}>

                    <div className="form-section-group personal-box">
                        <h4>👥 Personal Information</h4>
                        <div className="form-grid-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email (Read-Only)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleChange("phone", e.target.value)}
                                    placeholder="Enter Phone Number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section-group status-box">
                        <h4>📚 Academic & Current Status</h4>
                        <div className="form-grid-row dual-column">
                            <div className="form-group">
                                <label>University</label>
                                <input
                                    type="text"
                                    value={formData.university}
                                    onChange={(e) =>
                                        handleChange("university", e.target.value)}
                                    placeholder="e.g., Delhi University"
                                />
                            </div>
                            <div className="form-group">
                                <label>Course</label>
                                <input
                                    type="text"
                                    value={formData.course}
                                    onChange={(e) =>
                                        handleChange("course", e.target.value)}
                                    placeholder="e.g., B.TECH"
                                />
                            </div>
                            <div className="form-group">
                                <label>Profession</label>
                                <input
                                    type="text"
                                    value={formData.profession}
                                    onChange={(e) =>
                                        handleChange("profession", e.target.value)}
                                    placeholder="e.g., Student, Freelancer, SDE"
                                />
                            </div>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleChange("title", e.target.value)}
                                    placeholder="e.g., Frontend Developer, UX Designer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section-group social-box">
                        <h4>🌐 Social & Portfolio Links</h4>
                        <div className="form-grid-row">
                            <div className="form-group">
                                <label>GitHub Profile</label>
                                <input
                                    type="text"
                                    value={formData.github}
                                    onChange={(e) =>
                                        handleChange("github", e.target.value)}
                                    placeholder="https://github.com/username"
                                />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn Profile</label>
                                <input
                                    type="text"
                                    value={formData.linkedin}
                                    onChange={(e) =>
                                        handleChange("linkedin", e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;