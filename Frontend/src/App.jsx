import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
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


function App() {

    useEffect(() => {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "Dark");
    }, []);

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        fontFamily: "'Inter', sans-serif",
                    },
                    success: {
                        duration: 3000,
                    },
                    error: {
                        duration: 4000,
                        style: {
                            border: '1px solid #ef4444',
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/Horizon" element={<Horizon />} />
                <Route path="/horizon/workspace" element={<ApexWorkspace />} />
                <Route path="/tasks" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/features/:slug" element={<FeatureDetail />} />



                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;