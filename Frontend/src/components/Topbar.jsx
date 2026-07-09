import "../styles/Topbar.css";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

function Topbar({ onSearchChange }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const hour = new Date().getHours();
    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await api.get("/auth/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Topbar user fetch error", error);
            }
        };
        fetchUserData();
    }, []);


    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <header className="topbar">
            <div className="search-box">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                />
            </div>

            <div className="topbar-right">
                <button
                    className="notification"
                    onClick={() => toast("No new notifications 🔔", { icon: 'ℹ️' })}
                >
                    <FaBell />
                </button>

                <div className="user-info">
                    <h4>{greeting}, {user?.name ? user.name.split(" ")[0] : "User"} 👋🏻</h4>
                </div>


                <div className="avatar" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                    {userInitial}
                </div>
            </div>
        </header>
    );
}

export default Topbar;