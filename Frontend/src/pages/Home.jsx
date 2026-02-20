
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    Lock,
    Shield,
    Layout,
    Zap,
    Globe,
    Cpu,
    CheckCircle,
    Files as FilesIcon,
    Monitor
} from 'lucide-react';
import Logo from '../components/Logo';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-[#131314] flex flex-col selection:bg-primary selection:text-white">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-8 md:px-16 bg-white/80 dark:bg-[#131314]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#f1f3f4] dark:border-[#3c4043]">
                <Logo mode="full" size={36} />
                <div className="flex items-center gap-8">
                    <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#5f6368] dark:text-[#e3e3e3]">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#features" className="hover:text-primary transition-colors">Security</a>
                        <a href="#features" className="hover:text-primary transition-colors">Help</a>
                    </nav>
                    <div className="h-6 w-px bg-[#dadce0] dark:bg-[#3c4043] hidden sm:block"></div>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-primary font-bold text-sm hover:underline px-4 transition-all"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-md active:scale-95"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-24 px-8 md:px-16 overflow-hidden">
                    <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 space-y-10 text-center lg:text-left z-10">

                            <h1 className="text-6xl md:text-7xl font-bold text-[#3c4043] dark:text-white leading-[1.05] tracking-tight">
                                Safe storage for <br /> <span className="text-primary">all your files.</span>
                            </h1>

                            <p className="text-xl text-[#5f6368] dark:text-[#bdc1c6] font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                SkyVault Drive helps you store, share, and manage your files from anywhere. It's simple to use and keeps your data safe with high-level security.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-primary text-white px-10 py-5 rounded-full font-bold text-base hover:shadow-2xl transition-all flex items-center gap-3 active:scale-95"
                                >
                                    Create Free Account
                                    <ArrowRight size={20} />
                                </button>
                                <button className="px-10 py-5 bg-white dark:bg-[#3c4043] border border-[#dadce0] dark:border-transparent text-[#3c4043] dark:text-white rounded-full font-bold text-base hover:bg-[#f8f9fa] dark:hover:bg-[#1e1e1f] transition-all">
                                    Learn More
                                </button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><CheckCircle size={14} className="text-primary" /> Secure Cloud</div>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><CheckCircle size={14} className="text-primary" /> Private Storage</div>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-3xl relative">
                            <div className="bg-white dark:bg-[#1e1e1f] rounded-[40px] shadow-2xl overflow-hidden border border-[#dadce0] dark:border-[#3c4043] p-4 group">
                                <div className="bg-[#f8f9fa] dark:bg-[#131314] rounded-[32px] h-[480px] flex items-center justify-center relative group-hover:scale-[1.02] transition-transform duration-700">
                                    <div className="absolute top-10 left-10 p-4 bg-white dark:bg-[#3c4043] rounded-2xl shadow-lg border border-[#f1f3f4] dark:border-transparent animate-bounce duration-[3000ms]">
                                        <FilesIcon className="text-primary" size={32} />
                                    </div>
                                    <div className="absolute bottom-10 right-10 p-4 bg-white dark:bg-[#3c4043] rounded-2xl shadow-lg border border-[#f1f3f4] dark:border-transparent animate-bounce duration-[4000ms]">
                                        <Monitor className="text-[#34a853]" size={32} />
                                    </div>
                                    <div className="relative">
                                        <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                            <Logo size={120} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-[#f8f9fa] dark:bg-[#1e1e1f] py-32 border-y border-[#dadce0] dark:border-[#3c4043]">
                    <div className="max-w-7xl mx-auto px-8 md:px-16">
                        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                            <h2 className="text-4xl font-bold text-[#3c4043] dark:text-white">Why Choose SkyVault?</h2>
                            <p className="text-lg text-[#5f6368] dark:text-[#bdc1c6]">A simple way to keep your digital life organized and safe.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { icon: <Lock className="text-primary" size={40} />, title: 'Private & Secure', desc: 'Your files are for your eyes only. We use strong encryption to keep everything private.' },
                                { icon: <Zap className="text-[#fbbc04]" size={40} />, title: 'Fast Sync', desc: 'Your files are updated quickly across all your devices without using too much data.' },
                                { icon: <Globe className="text-[#34a853]" size={40} />, title: 'Access Anywhere', desc: 'Login from your phone, laptop, or tablet and your files will be right there waiting.' },
                                { icon: <Shield className="text-[#ea4335]" size={40} />, title: 'Safety First', desc: 'We check your shared links to make sure they are safe for you and your friends.' },
                                { icon: <Cpu className="text-primary" size={40} />, title: 'Easy Sharing', desc: 'Send large files to anyone with a simple link. No more messy email attachments.' },
                                { icon: <Layout className="text-[#1a73e8]" size={40} />, title: 'User Friendly', desc: 'The app is very easy to learn. You will be up and running in just a few seconds.' },
                            ].map((f, i) => (
                                <div key={i} className="bg-white dark:bg-[#131314] p-10 rounded-3xl border border-[#dadce0] dark:border-[#3c4043] hover:shadow-xl transition-all group">
                                    <div className="mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">{f.icon}</div>
                                    <h3 className="text-xl font-bold text-[#3c4043] dark:text-white mb-3">{f.title}</h3>
                                    <p className="text-sm text-[#5f6368] dark:text-[#bdc1c6] leading-relaxed font-medium">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-16 bg-white dark:bg-[#131314] px-8 md:px-16 border-t border-[#f1f3f4] dark:border-[#3c4043]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <Logo mode="full" size={30} />
                        <p className="text-xs text-[#5f6368] dark:text-[#bdc1c6] font-medium">Trusted by millions for safe online file storage.</p>
                    </div>

                    <div className="flex items-center gap-12 text-sm font-bold text-[#5f6368] dark:text-[#bdc1c6]">
                        <a href="#" className="hover:text-primary transition-colors">Support</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </div>

                    <p className="text-[11px] text-[#5f6368] dark:text-[#bdc1c6] font-black uppercase tracking-[3px]">© 2024 SkyVault Drive</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
