import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/Calendar";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

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
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/tasks" element={<Dashboard />} />


                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;