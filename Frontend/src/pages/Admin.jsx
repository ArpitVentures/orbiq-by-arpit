import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Dashboard.css";

function Admin() {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page")) || 1;
    const currentSearch = searchParams.get("search") || "";
    const currentRole = searchParams.get("role") || "";
    const currentPlan = searchParams.get("plan") || "";

    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchInput, setSearchInput] = useState(currentSearch);

    const fetchStats = async () => {
        try {
            const response = await api.get("/admin/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/users", {
                params: {
                    page: currentPage,
                    limit: 5,
                    search: currentSearch,
                    role: currentRole,
                    plan: currentPlan
                }
            });

            if (response.data && response.data.users) {
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages || 1);
                setTotalUsers(response.data.totalUsers || 0);
            } else if (Array.isArray(response.data)) {
                setUsers(response.data);
                setTotalPages(1);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching users execution stream. ❌");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, currentSearch, currentRole, currentPlan]);

    const updateURLParams = (newParams) => {
        const updated = new URLSearchParams(searchParams);

        Object.keys(newParams).forEach(key => {
            if (newParams[key] === null || newParams[key] === "") {
                updated.delete(key);
            } else {
                updated.set(key, String(newParams[key]));
            }
        });

        if (!newParams.hasOwnProperty('page')) {
            updated.set("page", "1");
        }
        setSearchParams(updated);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateURLParams({ search: searchInput, page: 1 });
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Topbar onSearchChange={() => {}} />

                <div className="dashboard-body" style={{ padding: "30px", color: "#fff" }}>

                    <div style={{ marginBottom: "30px" }}>
                        <h1 style={{ fontSize: "32px", fontWeight: "800" }}>Admin Command Center 🛠️</h1>
                        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                            Manage application nodes, scaling scopes, and database compliance grids.
                        </p>
                    </div>

                    {stats && (
                        <div className="stats-grid" style={{ marginBottom: "30px" }}>
                            <div style={{ background: "#1e293b", padding: "20px", borderRadius: "14px", border: "1px solid #334155" }}>
                                <h4 style={{ color: "#64748b", margin: 0 }}>Total Registrations</h4>
                                <p style={{ fontSize: "28px", fontWeight: "700", margin: "10px 0 0 0", color: "#38bdf8" }}>
                                    {stats.totalUsers}
                                </p>
                            </div>
                            <div style={{ background: "#1e293b", padding: "20px", borderRadius: "14px", border: "1px solid #334155" }}>
                                <h4 style={{ color: "#64748b", margin: 0 }}>Active Premium Licenses</h4>
                                <p style={{ fontSize: "28px", fontWeight: "700", margin: "10px 0 0 0", color: "#22c55e" }}>
                                    {stats.activePlans}
                                </p>
                            </div>
                            <div style={{ background: "#1e293b", padding: "20px", borderRadius: "14px", border: "1px solid #334155" }}>
                                <h4 style={{ color: "#64748b", margin: 0 }}>Tier Mix (Silver/Gold)</h4>
                                <p style={{ fontSize: "16px", fontWeight: "500", margin: "10px 0 0 0", color: "#cbd5e1" }}>
                                    🥈 {stats.silverPlans} Silver | 🥇 {stats.goldPlans} Gold
                                </p>
                            </div>
                        </div>
                    )}

                    <div style={{ background: "#1e293b", padding: "20px", borderRadius: "16px", marginBottom: "25px", border: "1px solid #334155" }}>
                        <form onSubmit={handleSearchSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center" }}>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{ flex: "1 1 250px", padding: "10px 15px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff" }}
                            />

                            <select
                                value={currentRole}
                                onChange={(e) => updateURLParams({ role: e.target.value, page: 1 })}
                                style={{ padding: "10px 15px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff" }}
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>

                            <select
                                value={currentPlan}
                                onChange={(e) => updateURLParams({ plan: e.target.value, page: 1 })}
                                style={{ padding: "10px 15px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff" }}
                            >
                                <option value="">All Plans</option>
                                <option value="Free">Free Tier</option>
                                <option value="Silver">Silver Tier</option>
                                <option value="Gold">Gold Tier</option>
                            </select>

                            <button type="submit" style={{ backgroundColor: "#2563eb", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Query</button>
                        </form>
                    </div>

                    <div style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                            <tr style={{ borderBottom: "1px solid #334155", backgroundColor: "#0f172a" }}>
                                <th style={{ padding: "15px" }}>Identity Name</th>
                                <th style={{ padding: "15px" }}>Email Node</th>
                                <th style={{ padding: "15px" }}>System Authority</th>
                                <th style={{ padding: "15px" }}>Active Subscription</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Syncing datastream operations...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Zero directory objects matched search metadata.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} style={{ borderBottom: "1px solid #334155", transition: "0.2s" }} className="table-row-hover">
                                        <td style={{ padding: "15px", fontWeight: "600" }}>{user.name}</td>
                                        <td style={{ padding: "15px", color: "#cbd5e1" }}>{user.email}</td>
                                        <td style={{ padding: "15px" }}>
                                                <span style={{ backgroundColor: user.role === "admin" ? "#7c3aed" : "#475569", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                                                    {user.role ? user.role.toUpperCase() : "USER"}
                                                </span>
                                        </td>
                                        <td style={{ padding: "15px" }}>
                                                <span style={{ color: user.plan === "Gold" ? "#eab308" : user.plan === "Silver" ? "#94a3b8" : "#3b82f6", fontWeight: "600" }}>
                                                    {user.plan || "Free"}
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                        <span style={{ color: "#64748b", fontSize: "14px" }}>Showing total {totalUsers} directory targets</span>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                disabled={currentPage === 1 || loading}
                                onClick={() => updateURLParams({ page: currentPage - 1 })}
                                style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: currentPage === 1 ? "#0f172a" : "#1e293b", color: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                            >
                                Prev
                            </button>
                            <span style={{ padding: "8px 12px", color: "#38bdf8", fontWeight: "600" }}>Page {currentPage} of {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages || loading}
                                onClick={() => updateURLParams({ page: currentPage + 1 })}
                                style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #334155",
                                    backgroundColor: currentPage === totalPages ? "#0f172a" : "#1e293b", color: "#fff",
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Admin;