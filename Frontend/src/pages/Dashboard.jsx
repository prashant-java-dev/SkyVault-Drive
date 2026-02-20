
import React, { useState, useEffect } from 'react';
import {
    Monitor,
    Laptop,
    Smartphone,
    ChevronRight,
    Info,
    Clock,
    ShieldCheck,
    Zap,
    HardDrive,
    Files as FilesIcon,
    Star,
    FileText,
    Image as ImageIcon,
    FileCode,
    ArrowRight,
    User as UserIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const Dashboard = () => {
    const { authState } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [recentFiles, setRecentFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const files = await apiService.getFiles();
                // The backend returns only files for this user, so explicit filtering might simply check empty conditions
                // or re-verify. 
                // Note: Field mapping assumes backend returns frontend-compatible JSON.
                // If backend properties differ (e.g. fileName vs originalName), this needs Model adjustment.
                // Assuming backend works as expected for now.
                const myFiles = files.filter(f => !f.isDeleted);
                setRecentFiles(myFiles.slice(0, 4));
            } catch (error) {
                console.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };
        if (authState?.user?.id) {
            loadData();
        }
    }, [authState.user?.id]);

    const getFileIcon = (type, size = 20) => {
        if (type?.startsWith('image')) return <ImageIcon className="text-red-500" size={size} />;
        if (type === 'application/pdf') return <FileText className="text-orange-500" size={size} />;
        return <FileCode className="text-primary" size={size} />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-white dark:bg-[#131314]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[1px]">Your account is active</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#3c4043] dark:text-white tracking-tighter">
                        Hi, <span className="text-primary">{authState.user?.fullName?.split(' ')[0] || 'User'}</span>
                    </h1>
                    <p className="text-sm text-[#5f6368] dark:text-[#bdc1c6] font-medium uppercase tracking-[1px]">Member Status: {authState.user?.role}</p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-[#1f1f21] p-4 rounded-3xl border border-[#dadce0] dark:border-[#202124] shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
                        <p className="text-sm font-bold dark:text-white truncate max-w-[150px]">{authState.user?.fullName || authState.user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Quick Access Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-[11px] font-black uppercase tracking-[3px] text-slate-400 flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" /> Recent Files
                    </h2>
                    <button
                        onClick={() => navigate('/files')}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                    >
                        View All Files <ArrowRight size={12} />
                    </button>
                </div>

                {recentFiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentFiles.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => navigate('/files')}
                                className="bg-white dark:bg-[#131314] p-5 rounded-3xl border border-[#dadce0] dark:border-[#202124] hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group"
                            >
                                <div className="aspect-video bg-slate-50 dark:bg-[#1a1a1c] rounded-2xl mb-4 flex items-center justify-center group-hover:bg-primary/5 transition-all overflow-hidden">
                                    {getFileIcon(file.mimetype, 40)}
                                </div>
                                <p className="text-sm font-bold truncate dark:text-white mb-1">{file.originalName}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{new Date(file.uploadDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-16 bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-[#dadce0] dark:border-white/10 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300">
                            <FilesIcon size={32} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-[2px] text-slate-400">You haven't uploaded any files yet</p>
                            <button onClick={() => navigate('/files')} className="mt-4 text-[10px] font-black text-primary uppercase tracking-[2px] border-b border-primary/30 pb-1">Upload Your First File</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Storage Infrastructure */}
            <div className="bg-white dark:bg-[#131314] rounded-[3rem] border border-[#dadce0] dark:border-[#202124] overflow-hidden shadow-sm">
                <div className="p-10 border-b border-[#f1f3f4] dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <HardDrive size={24} className="text-primary" />
                        <h2 className="text-xl font-black dark:text-white tracking-tight">My Storage</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">7.2% Used</span>
                </div>

                <div className="p-12 flex flex-col lg:flex-row items-center gap-20">
                    <div className="relative w-64 h-64 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100 dark:text-white/5" />
                            <circle
                                cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="16" fill="transparent"
                                strokeDasharray="691.15"
                                strokeDashoffset={691.15 * (1 - 0.072)}
                                className="text-primary transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-[#3c4043] dark:text-white">1.08<span className="text-xl">GB</span></span>
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[2px]">Total Space</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full space-y-10">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { label: 'Photos & Videos', size: '1.08 GB', color: '#1a73e8' },
                                { label: 'Documents', size: '0.0 GB', color: '#ea4335' },
                                { label: 'Others', size: '0.0 GB', color: '#fbbc04' },
                                { label: 'Trash', size: '0.0 GB', color: '#34a853' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-5">
                                    <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">{item.label}</p>
                                        <p className="text-xs text-secondary font-black uppercase tracking-tighter">{item.size}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
