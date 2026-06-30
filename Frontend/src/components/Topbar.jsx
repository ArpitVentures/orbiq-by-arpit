import "../styles/Topbar.css";
import { FaBell, FaSearch } from "react-icons/fa";

function Topbar() {
    return (
        <header className="topbar">

            <div className="search-box">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search tasks..."
                />
            </div>

            <div className="topbar-right">

                <button className="notification">
                    <FaBell />
                </button>

                <div className="user-info">
                    <h4>Good Evening 👋</h4>
                    <span>Arpit</span>
                </div>

                <div className="avatar">
                    A
                </div>

            </div>

        </header>
    );
}

export default Topbar;