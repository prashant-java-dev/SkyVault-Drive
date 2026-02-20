
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Logo from '../components/Logo';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            const response = await apiService.login({ email, password });
            login(response.user, response.token); // Assuming backend response structure matches
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <div className="bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#3c4043] rounded-[2.5rem] px-10 py-12 w-full max-w-[450px] shadow-2xl">
                <div className="flex flex-col items-center mb-10">
                    <Logo size={56} className="mb-6" />
                    <h1 className="text-3xl font-black text-[#3c4043] dark:text-white tracking-tighter">Login</h1>
                    <p className="text-sm mt-2 text-secondary font-medium">Welcome back to SkyVault Drive</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 text-xs rounded-2xl border border-red-100 font-bold flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-5">
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-[#dadce0] dark:border-[#3c4043] rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white peer placeholder-transparent"
                                placeholder="Email address"
                                value={email}
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email" className="absolute left-6 -top-2 px-1 bg-white dark:bg-[#1f1f1f] text-[10px] font-black uppercase tracking-widest text-secondary transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:left-6 peer-placeholder-shown:font-medium peer-focus:-top-2 peer-focus:left-6 peer-focus:text-primary cursor-text">
                                Email
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-[#dadce0] dark:border-[#3c4043] rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white peer placeholder-transparent"
                                placeholder="Password"
                                value={password}
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password" className="absolute left-6 -top-2 px-1 bg-white dark:bg-[#1f1f1f] text-[10px] font-black uppercase tracking-widest text-secondary transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:left-6 peer-placeholder-shown:font-medium peer-focus:-top-2 peer-focus:left-6 peer-focus:text-primary cursor-text">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-4 text-slate-400 hover:text-primary"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" title="Forgot Password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="flex flex-col gap-6 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary hover:bg-blue-700 text-white w-full py-5 rounded-2xl font-black uppercase tracking-[2px] text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? 'Logging in...' : (
                                <>
                                    Login Now
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                        <div className="text-center">
                            <Link to="/register" className="text-[11px] font-black uppercase tracking-[2px] text-secondary hover:text-primary transition-colors">
                                Create a New Account
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            <div className="mt-12 flex items-center gap-8 text-[10px] font-black uppercase tracking-[2px] text-secondary">
                <button className="hover:text-primary transition-colors">Privacy</button>
                <button className="hover:text-primary transition-colors">Terms</button>
                <button className="hover:text-primary transition-colors">Help</button>
            </div>
        </div>
    );
}
