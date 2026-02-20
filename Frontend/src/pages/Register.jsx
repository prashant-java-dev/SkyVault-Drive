
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';
import Logo from '../components/Logo';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const passwordStrength = (pw) => {
        if (!pw) return 0;
        let strength = 0;
        if (pw.length > 7) strength += 25;
        if (/[A-Z]/.test(pw)) strength += 25;
        if (/[0-9]/.test(pw)) strength += 25;
        if (/[^A-Za-z0-9]/.test(pw)) strength += 25;
        return strength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const response = await apiService.register({
                name: formData.fullName, // Map fullName to name for backend
                email: formData.email,
                password: formData.password
            });

            navigate('/verify-otp', {
                state: {
                    email: formData.email,
                    userId: response.userId
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                    <Logo size={60} />
                </div>
                <h1 className="text-4xl font-black text-[#3c4043] dark:text-white mb-2 tracking-tighter leading-none">Sign Up</h1>
                <p className="text-secondary font-medium">Create your free account to start sharing files.</p>
            </div>

            <div className="bg-white dark:bg-[#1f1f1f] p-10 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-[#3c4043]">
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-2xl font-bold flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-secondary px-2">Your Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                required
                                className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#3c4043] rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 dark:text-white font-medium"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-secondary px-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#3c4043] rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 dark:text-white font-medium"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-secondary px-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#3c4043] rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 dark:text-white font-medium"
                                placeholder="Choose a password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-1 mt-3 px-2">
                            {[0, 25, 50, 75].map((lvl) => (
                                <div
                                    key={lvl}
                                    className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength(formData.password) > lvl ? 'bg-primary' : 'bg-slate-100 dark:bg-white/10'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-secondary px-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#3c4043] rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 dark:text-white font-medium"
                                placeholder="Repeat password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-primary hover:bg-blue-700 text-white font-black uppercase tracking-[2px] text-xs rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group transition-all mt-6 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Create My Account
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                    <p className="text-secondary text-sm font-medium">
                        Already have an account? {' '}
                        <Link to="/login" className="text-primary font-black uppercase tracking-widest text-[11px] hover:underline ml-2">
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-[2px] font-black">
                <ShieldCheck size={14} className="text-primary" />
                Safe and Secure Storage
            </div>
        </div>
    );
};

export default Register;
