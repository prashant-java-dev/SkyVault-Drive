
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const AuthLayout = () => {
    const { authState } = useAuth();

    if (authState.isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
            {/* Form Section */}
            <div className="flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-4 lg:hidden mb-12">
                        <Logo size={40} />
                        <span className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter">
                            SKY<span className="text-red-600">VAULT</span>
                        </span>
                    </div>
                    <Outlet />
                </div>
            </div>

            {/* Decorative Section */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl -mr-64 -mt-64 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse duration-700"></div>

                <div className="relative z-10 text-center px-12">
                    <div className="flex flex-col items-center gap-6 mb-12">
                        <div className="p-6 bg-slate-950 rounded-[2.5rem] shadow-2xl shadow-red-600/20 transform -rotate-3 border border-red-900/20">
                            <Logo size={100} />
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tight">
                            SkyVault <span className="text-red-600">Enterprise</span>
                        </h1>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                        Bank-grade encryption. <br /><span className="text-red-500">Cloud-native sync technology.</span>
                    </h2>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        {[
                            { title: 'Encrypted', desc: 'AES-256 secure storage' },
                            { title: 'Lightning Sync', desc: 'Delta-sync optimized speed' },
                            { title: 'Public Sharing', desc: 'Replicated secure public links' },
                            { title: 'Audit Ready', desc: 'Detailed compliance logging' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-slate-950/50 backdrop-blur-md p-6 rounded-3xl border border-red-900/10 hover:border-red-600/50 transition-all cursor-default group">
                                <p className="text-white font-black uppercase text-[10px] tracking-widest mb-1 group-hover:text-red-500 transition-colors">{feature.title}</p>
                                <p className="text-slate-500 text-xs font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
