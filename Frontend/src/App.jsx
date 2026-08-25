import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeatureDetail from "./components/Landing/Features/FeatureDetail";

import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Signup_Backup from "./pages/Signup_Backup.jsx";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/Orbit.jsx";
import Settings from "./pages/Settings";
import "./styles/Variables.css";
import Analytics from "./pages/Analytics";
import ApexWorkspace from "./pages/ApexWorkspace.jsx";
import Horizon from "./pages/Horizon.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "Dark");
    }, []);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "orbiq_logout_event" && event.newValue) {
                try {
                    const eventData = JSON.parse(event.newValue);
                    const loggedOutUserId = eventData.loggedOutUserId;

                    const activeUserStr = sessionStorage.getItem("user");
                    if (!activeUserStr) return;

                    const activeUser = JSON.parse(activeUserStr);
                    const activeUserId = activeUser.id || activeUser._id;

                    if (loggedOutUserId && activeUserId === loggedOutUserId) {
                        sessionStorage.clear();
                        navigate("/login", {
                            replace: true,
                            state: { loggedOut: true }
                        });
                    }

                } catch (e) {
                    console.error("Logout event sync error:", e);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [navigate]);

    useEffect(() => {
        const handlePageShow = () => {
            const token = sessionStorage.getItem("token");

            const protectedPaths = [
                "/dashboard",
                "/profile",
                "/calendar",
                "/settings",
                "/analytics",
                "/Horizon",
                "/horizon/workspace",
                "/tasks",
                "/admin"
            ];

            if (
                !token &&
                protectedPaths.some((path) =>
                    window.location.pathname.startsWith(path)
                )
            ) {
                window.location.replace("/login");
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,

                    style: {
                        background: 'rgba(15, 23, 42, 0.94)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#f8fafc',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                        maxWidth: '380px',
                    },

                    success: {
                        duration: 3000,
                        style: {
                            border: '1px solid #22c55e',
                            boxShadow: '0 0 16px rgba(34, 197, 94, 0.25)',
                        }
                    },

                    error: {
                        duration: 4000,
                        style: {
                            border: '1px solid #ef4444',
                            boxShadow: '0 0 18px rgba(239, 68, 68, 0.35)',
                        }
                    }
                }}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup_Backup />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route path="/pricing" element={<Pricing />} />

                <Route
                    path="/calendar"
                    element={
                        <ProtectedRoute>
                            <CalendarPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/Horizon"
                    element={
                        <ProtectedRoute>
                            <Horizon />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/horizon/workspace"
                    element={
                        <ProtectedRoute>
                            <ApexWorkspace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    }
                />

                <Route path="/features/:slug" element={<FeatureDetail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;