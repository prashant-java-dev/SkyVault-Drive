
import React from 'react';
import { Shield, Key, Mail, Bell, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { authState } = useAuth();
    const user = authState.user;

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-[#121212] p-10 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                    {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-3xl font-black dark:text-white">{user?.fullName || 'User'}</h1>
                        {user?.emailVerified && <ShieldCheck className="text-emerald-500" size={24} />}
                    </div>
                    <p className="text-slate-500 font-medium">{user?.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                        <span className="px-4 py-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/20">{user?.role || 'MEMBER'}</span>
                        <span className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/10">Active Session</span>
                    </div>
                </div>
                <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest">Edit Profile</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm">
                    <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-3">
                        <Shield className="text-red-600" size={20} />
                        Security Settings
                    </h3>
                    <div className="space-y-6">
                        {[
                            { icon: <Key size={18} />, label: 'Change Password', status: 'Last changed 2mo ago' },
                            { icon: <ShieldCheck size={18} />, label: 'Two-Factor Auth', status: 'Enabled' },
                            { icon: <Mail size={18} />, label: 'Email Notifications', status: 'security@skyvault.io' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all text-slate-500">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">{item.label}</p>
                                        <p className="text-xs text-slate-500">{item.status}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                                    <Bell size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-slate-200 dark:border-red-900/10 shadow-sm">
                    <h3 className="text-lg font-black dark:text-white mb-8 flex items-center gap-3">
                        <Zap className="text-amber-500" size={20} />
                        Recent Activity
                    </h3>
                    <div className="space-y-6">
                        {[
                            { event: 'Login attempt from 192.168.1.1', time: '2 hours ago' },
                            { event: 'Sync complete: My Documents', time: '5 hours ago' },
                            { event: 'Password updated', time: 'Yesterday' },
                            { event: 'New device authorized: iPhone 15', time: '3 days ago' },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-1 bg-slate-100 dark:bg-white/5 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-bold dark:text-slate-200">{activity.event}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 w-full py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors">Download Audit Log</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
