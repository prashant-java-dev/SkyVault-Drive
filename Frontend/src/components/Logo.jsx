
import React from 'react';

const Logo = ({ size = 40, mode = 'monogram', className = "" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Geometric SkyVault Triangle - Advanced Style */}
                <path d="M12 4L28 4L38 24L22 24L12 4Z" fill="#FBBC04" />
                <path d="M2 24L12 4L22 24L2 24Z" fill="#1A73E8" />
                <path d="M12 24L22 4L32 24L12 24Z" fill="#34A853" opacity="0.85" />
                <rect x="8" y="30" width="24" height="4" rx="2" fill="#EA4335" />
            </svg>
            {mode === 'full' && (
                <span className="text-[22px] font-semibold text-[#5f6368] dark:text-[#e3e3e3] tracking-tight">
                    SkyVault <span className="font-normal opacity-70">Drive</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
