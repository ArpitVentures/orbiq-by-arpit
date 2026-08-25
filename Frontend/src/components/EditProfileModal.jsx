import { useState } from "react";
import "./../styles/EditProfileModal.css";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { FaCloudUploadAlt, FaUndo, FaTrash, FaCamera, FaSpinner } from "react-icons/fa";

const getProfileData = (user) => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    university: user?.university || "",
    course: user?.course || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    profession: user?.profession || "",
    title: user?.title || ""
});

const quotes = [
    "🛰️ Deep space recon requires precise crew identification.",
    "🚀 Your ORBIQ crew profile is your mission identity.",
    "📡 Calibrating orbital coordinates... Ensure your mission logs are accurate.",
    "🪐 Adjusting telemetry credentials. Stand by for orbital sync.",
    "👨‍🚀 Every commander needs an updated profile before launching into deep space."
];

function EditProfileModal({ onClose, user, refreshProfile }) {
    const [formData, setFormData] = useState(() => getProfileData(user));
    const [initialFormData] = useState(() => getProfileData(user));

    const [localAvatar, setLocalAvatar] = useState(
        user?.useGooglePhoto && user?.googleAvatar
            ? user.googleAvatar
            : user?.avatar || null
    );

    const [uploading, setUploading] = useState(false);
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
    const [randomQuote] = useState(() =>
        quotes[Math.floor(Math.random() * quotes.length)]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image exceeds the 5 MB limit.\nChoose a smaller profile picture.");
            return;
        }

        const data = new FormData();
        data.append("avatar", file);

        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            setUploading(true);
            const token = sessionStorage.getItem("token");

            toast.loading("Updating your profile picture...", { id: "avatarUpload" });

            const response = await api.put("/auth/profile", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setLocalAvatar(response.data.user?.avatar || null);

            toast.success("Your new profile picture is live! ✨", {
                id: "avatarUpload"
            });

            await refreshProfile();

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Couldn't upload your profile picture. Please try again.", { id: "avatarUpload" });
        } finally {
            setUploading(false);
        }
    };

    const handleRevertAvatar = async () => {
        try {
            setUploading(true);
            const token = sessionStorage.getItem("token");

            toast.loading("Syncing Google avatar...", {
                id: "revertAvatar"
            });

            const response = await api.post(
                "/auth/revert-avatar",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLocalAvatar(response.data.googleAvatar);

            const updatedUser = {
                ...user,
                avatar: null,
                googleAvatar: response.data.googleAvatar,
                useGooglePhoto: true
            };

            sessionStorage.setItem(
                "orbiq_user_profile",
                JSON.stringify(updatedUser)
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            toast.success(
                "Avatar synced back with Google account! ☀️",
                { id: "revertAvatar" }
            );

            await refreshProfile();

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to revert avatar ❌",
                { id: "revertAvatar" }
            );
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        try {
            setUploading(true);
            const token = sessionStorage.getItem("token");

            toast.loading("Removing profile picture...", { id: "removeAvatar" });

            await api.put(
                "/auth/profile",
                {
                    avatar: null,
                    useGooglePhoto: false
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setLocalAvatar(null);

            const updatedUser = {
                ...user,
                avatar: null,
                useGooglePhoto: false
            };

            sessionStorage.setItem("orbiq_user_profile", JSON.stringify(updatedUser));
            sessionStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success(
                "Profile picture removed. Reverted to ORBIQ initials! 🎨",
                { id: "removeAvatar" }
            );

            await refreshProfile();

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Failed to remove avatar ❌",
                { id: "removeAvatar" }
            );
        } finally {
            setUploading(false);
        }
    };

    const hasChanges = Object.keys(initialFormData).some(
        (key) => formData[key] !== initialFormData[key]
    );

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("token");

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

            toast.success("Crew Dossier Synchronized Successfully! 🚀", {
                duration: 2500
            });

            onClose();

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Failed to update profile ❌"
            );
        }
    };

    const userNameDisplay = formData.name || user?.name || "Crew Member";

    const nameParts = userNameDisplay.trim().split(/\s+/);

    const initials =
        nameParts.length === 1
            ? nameParts[0].charAt(0).toUpperCase()
            : (
                nameParts[0].charAt(0) +
                nameParts[nameParts.length - 1].charAt(0)
            ).toUpperCase();

    const defaultInitialAvatar =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff&size=200`;

    const currentAvatar = localAvatar || defaultInitialAvatar;

    const hasGoogleAvatar = Boolean(user?.googleAvatar);
    const isGoogleAvatarActive = Boolean(
        hasGoogleAvatar &&
        localAvatar === user?.googleAvatar
    );
    const isDefaultAvatarActive = !localAvatar;
    const isCustomUploaded = Boolean(localAvatar) && !isGoogleAvatarActive;

    return (
        <div className="modal-overlay">
            <div className="edit-modal">

                <button className="close-btn" onClick={onClose}>
                    ✖
                </button>

                <h2>Edit Crew Profile</h2>

                <p className="edit-message">
                    {randomQuote}
                </p>

                <div className="avatar-section">

                    <div
                        onClick={() => !uploading && document.getElementById("cloudinary-modal-avatar-upload")?.click()}
                        onMouseEnter={() => setIsHoveringAvatar(true)}
                        onMouseLeave={() => setIsHoveringAvatar(false)}
                        style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid rgba(34, 211, 238, 0.4)",
                            background: "#0f172a",
                            cursor: uploading ? "not-allowed" : "pointer",
                            boxShadow: isHoveringAvatar ? "0 0 20px rgba(34, 211, 238, 0.35)" : "none",
                            transition: "all 0.25s ease"
                        }}
                    >
                        <img
                            src={currentAvatar}
                            alt="Crew Avatar"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: isHoveringAvatar && !uploading ? "brightness(0.65)" : "none",
                                transition: "all 0.25s ease"
                            }}
                            onError={(e) => {
                                e.target.src = defaultInitialAvatar;
                            }}
                        />

                        <div style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            opacity: isHoveringAvatar && !uploading ? 1 : 0,
                            transition: "opacity 0.25s ease",
                            pointerEvents: "none"
                        }}>
                            <FaCamera size={16} />
                            <span style={{ fontSize: "10px", fontWeight: "700", marginTop: "2px" }}>Change</span>
                        </div>
                    </div>

                    <p style={{ fontSize: "11px", color: "#64748b", margin: "0" }}>
                        Supported: JPG, PNG, WEBP • Max 5 MB
                    </p>

                    <div className="avatar-actions">
                        <input
                            type="file"
                            id="cloudinary-modal-avatar-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            disabled={uploading}
                        />

                        <label
                            htmlFor="cloudinary-modal-avatar-upload"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                minWidth: "180px",
                                cursor: uploading ? "not-allowed" : "pointer",
                                padding: "10px 18px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#fff",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {uploading ? (
                                <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <FaCloudUploadAlt size={14} />
                            )}
                            {uploading ? "Uploading..." : "Change Photo"}
                        </label>

                        {hasGoogleAvatar && isCustomUploaded && (
                            <button
                                type="button"
                                onClick={handleRevertAvatar}
                                disabled={uploading}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    minWidth: "180px",
                                    cursor: uploading ? "not-allowed" : "pointer",
                                    padding: "10px 18px",
                                    background: "rgba(6, 182, 212, 0.1)",
                                    border: "1px solid rgba(6, 182, 212, 0.3)",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#22d3ee",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <FaUndo size={11} /> Restore Google Avatar
                            </button>
                        )}

                        {!isDefaultAvatarActive && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                disabled={uploading}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    minWidth: "180px",
                                    cursor: uploading ? "not-allowed" : "pointer",
                                    padding: "10px 18px",
                                    background: "rgba(239, 68, 68, 0.1)",
                                    border: "1px solid rgba(239, 68, 68, 0.25)",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#f87171",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <FaTrash size={11} /> Remove Photo
                            </button>
                        )}
                    </div>
                </div>

                <form
                    className="modal-segmented-form"
                    onSubmit={handleSave}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return;

                        const target = e.target;

                        if (
                            target.tagName !== "INPUT" ||
                            target.type === "file"
                        ) {
                            return;
                        }

                        e.preventDefault();

                        const inputs = Array.from(
                            e.currentTarget.querySelectorAll(
                                'input:not([disabled]):not([type="file"])'
                            )
                        );

                        const currentIndex = inputs.indexOf(target);

                        if (currentIndex === -1) return;

                        const nextInput = inputs[currentIndex + 1];

                        if (nextInput) {
                            nextInput.focus();
                            nextInput.select?.();
                        } else {
                            e.currentTarget.requestSubmit();
                        }
                    }}
                >

                    <div className="form-section-group personal-box">
                        <h4>👨‍🚀 Crew Identity</h4>
                        <div className="form-grid-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)}
                                    required
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
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleChange("phone", e.target.value)}
                                    placeholder="+91 XXXXX XXXXX"
                                    maxLength="14"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section-group status-box">
                        <h4>🎓 Mission Background</h4>
                        <div className="form-grid-row dual-column">
                            <div className="form-group">
                                <label>Mission Base / University</label>
                                <input
                                    type="text"
                                    value={formData.university}
                                    onChange={(e) =>
                                        handleChange("university", e.target.value)}
                                    placeholder="e.g., Delhi University"
                                />
                            </div>
                            <div className="form-group">
                                <label>Specialization / Course</label>
                                <input
                                    type="text"
                                    value={formData.course}
                                    onChange={(e) =>
                                        handleChange("course", e.target.value)}
                                    placeholder="e.g., B.TECH Computer Science"
                                />
                            </div>
                            <div className="form-group">
                                <label>Current Role</label>
                                <input
                                    type="text"
                                    value={formData.profession}
                                    onChange={(e) =>
                                        handleChange("profession", e.target.value)}
                                    placeholder="e.g., Student, SDE Intern"
                                />
                            </div>
                            <div className="form-group">
                                <label>Mission Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleChange("title", e.target.value)}
                                    placeholder="e.g., Frontend Specialist, UX Architect"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section-group social-box">
                        <h4>🌍 Mission Network</h4>
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

                    <div className="modal-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={!hasChanges}
                        >
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;