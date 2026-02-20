
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicFileShare from './pages/PublicFileShare';

// Helper component for Protected Routes
const ProtectedRoute = ({ children, role }) => {
    const { authState } = useAuth();

    if (authState.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-[#0a0a0a]">
                <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">SkyVault Secure Link...</p>
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && authState.user?.role !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const App = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Route>

                    <Route path="/share/:token" element={<PublicFileShare />} />

                    {/* Enterprise User Routes */}
                    <Route element={<ProtectedRoute><MainLayout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/files" element={<Files filterMode="all" />} />
                        <Route path="/recent" element={<Files filterMode="recent" />} />
                        <Route path="/starred" element={<Files filterMode="starred" />} />
                        <Route path="/trash" element={<Files filterMode="trash" />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
