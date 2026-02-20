
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Files as FilesIcon,
    Clock,
    Star,
    Trash2,
    Cloud,
    Menu,
    Search,
    Settings,
    HelpCircle,
    Plus,
    Monitor,
    LayoutGrid,
    Info,
    LogOut,
    Sun,
    Moon,
    ChevronRight,
    User,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const MainLayout = ({ toggleDarkMode, isDarkMode }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { authState, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'My Files', path: '/files', icon: <FilesIcon size={20} /> },
        { name: 'Computers', path: '/dashboard', icon: <Monitor size={20} /> },
        { name: 'Recent', path: '/recent', icon: <Clock size={20} /> },
        { name: 'Starred', path: '/starred', icon: <Star size={20} /> },
        { name: 'Trash', path: '/trash', icon: <Trash2 size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-[#f8f9fa] dark:bg-[#0a0a0b] text-[#3c4043] dark:text-[#e3e3e3] overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`transition-all duration-300 flex flex-col pt-2 bg-white dark:bg-[#131314] ${isSidebarCollapsed ? 'w-[72px]' : 'w-72'} h-full border-r border-[#dadce0] dark:border-[#202124] z-30 shadow-sm`}
            >
                <div className="px-4 py-2 flex items-center h-16">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-3 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] rounded-full transition-all active:scale-95"
                    >
                        <Menu size={20} className="text-secondary" />
                    </button>
                    {!isSidebarCollapsed && <Logo mode="full" size={32} className="ml-2" />}
                </div>

                <div className="px-4 py-6">
                    <button className={`
            flex items-center gap-3 py-4 bg-white dark:bg-[#3c4043] border border-[#dadce0] dark:border-transparent rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 group
            ${isSidebarCollapsed ? 'w-12 h-12 justify-center px-0' : 'px-6'}
          `}>
                        <Plus size={24} className="text-primary group-hover:rotate-90 transition-transform duration-300" />
                        {!isSidebarCollapsed && <span className="font-bold text-sm tracking-wide">New</span>}
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-full text-sm font-semibold transition-all duration-200 group
                ${isActive
                                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-[#8ab4f8] shadow-inner'
                                    : 'text-secondary dark:text-[#e3e3e3] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043]'}
                ${isSidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : ''}
              `}
                        >
                            <span className={`flex-shrink-0 transition-transform group-hover:scale-110`}>{item.icon}</span>
                            {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {!isSidebarCollapsed && (
                    <div className="mx-6 my-8 p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-[#dadce0] dark:border-white/5">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary mb-3">
                            <Cloud size={14} className="text-primary" />
                            <span>Storage Used</span>
                        </div>
                        <div className="h-1.5 bg-[#dadce0] dark:bg-[#3c4043] rounded-full mb-2 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-700" style={{ width: '72%' }}></div>
                        </div>
                        <p className="text-[10px] text-secondary font-bold">10.8 GB of 15 GB used</p>
                    </div>
                )}
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 gap-8 flex-shrink-0 bg-white/50 dark:bg-[#0a0a0b]/50 backdrop-blur-xl border-b border-[#dadce0] dark:border-[#202124] z-20">
                    <div className="flex-1 max-w-3xl bg-[#f1f3f4] dark:bg-[#303134] rounded-full flex items-center px-6 py-2.5 transition-all focus-within:bg-white focus-within:shadow-xl dark:focus-within:bg-[#3c4043] group border border-transparent focus-within:border-primary/20">
                        <Search size={20} className="text-secondary mr-4" />
                        <input
                            type="text"
                            placeholder="Search for files"
                            className="bg-transparent border-none w-full text-[15px] font-medium outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleDarkMode}
                            className="p-3 hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] rounded-full text-secondary transition-all"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="h-6 w-px bg-[#dadce0] dark:bg-[#3c4043] mx-2"></div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md hover:shadow-primary/30 transition-all active:scale-95"
                        >
                            {authState.user?.fullName?.charAt(0) || 'U'}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-white dark:bg-[#0a0a0b]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
