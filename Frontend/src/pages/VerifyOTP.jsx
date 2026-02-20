
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, RefreshCw, Mail } from 'lucide-react';
import { apiService } from '../services/api';
import Logo from '../components/Logo';

const VerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const inputs = useRef([]);

    const userId = location.state?.userId;
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (!userId) navigate('/register');
    }, [userId]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (element, index) => {
        if (isNaN(Number(element.value))) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto focus next input
        if (element.value && index < 5) {
            if (inputs.current[index + 1]) inputs.current[index + 1].focus();
        }
    };

    const handleResend = async () => {
        if (timer > 0 || isResending) return;

        setIsResending(true);
        setError('');
        setSuccessMsg('');

        try {
            await apiService.resendOtp(userId);
            setSuccessMsg('A new code has been sent.');
            setTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend code.");
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            await apiService.verifyOtp(userId, otp.join(''));
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center mb-10">
                <div className="flex justify-center mb-8">
                    <Logo size={60} />
                </div>
                <h1 className="text-3xl font-black text-[#3c4043] dark:text-white mb-2 tracking-tighter">Verify Your <span className="text-primary">Email</span></h1>
                <p className="text-secondary font-medium text-sm">
                    We sent a 6-digit code to <br />
                    <span className="font-bold text-[#3c4043] dark:text-slate-200">{email || 'your email'}</span>
                </p>
            </div>

            <div className="bg-white dark:bg-[#1f1f1f] p-10 rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-[#3c4043] relative overflow-hidden">

                <div className="mb-8 p-5 bg-blue-50 dark:bg-primary/5 rounded-2xl border border-blue-100 dark:border-primary/10 flex gap-4 items-center">
                    <div className="bg-white dark:bg-[#1f1f1f] p-2 rounded-xl shadow-sm">
                        <Mail size={20} className="text-primary" />
                    </div>
                    <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-tight font-medium">
                        <span className="font-black block uppercase mb-1 tracking-widest text-[9px] text-primary">Need Help?</span>
                        If you do not see the email, please check your spam folder or wait a minute.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] rounded-2xl text-center font-black uppercase tracking-widest border border-red-100 animate-in shake">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-[10px] rounded-2xl text-center font-black uppercase tracking-widest border border-emerald-100 animate-in fade-in">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex justify-between gap-3">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el) => { if (el) inputs.current[index] = el; }}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                        if (inputs.current[index - 1]) inputs.current[index - 1].focus();
                                    }
                                }}
                                className="w-full h-16 sm:h-20 text-center text-3xl font-black bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-[#3c4043] rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading || otp.join('').length < 6}
                            className="w-full py-5 bg-primary hover:bg-blue-700 text-white font-black uppercase tracking-[2px] text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Code'}
                        </button>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={timer > 0 || isResending}
                            className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary disabled:opacity-50 transition-colors py-2"
                        >
                            {isResending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            {timer > 0 ? `Wait ${timer}s to Resend` : 'Send Code Again'}
                        </button>
                    </div>
                </form>
            </div>

            <button
                onClick={() => navigate('/login')}
                className="mt-12 flex items-center justify-center gap-3 w-full text-secondary hover:text-primary font-black uppercase tracking-widest text-[10px] transition-colors"
            >
                <ArrowLeft size={14} />
                Go Back to Login
            </button>
        </div>
    );
};

export default VerifyOTP;
