'use client';
import React, { memo } from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

const AppLogo = memo(function AppLogo({
  size = 36,
  className = '',
  onClick,
}: AppLogoProps) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="40" height="40" rx="10" fill="#047857" />
        {/* Stylized TenQ Monogram with Radar Node */}
        <circle cx="19" cy="18" r="8.5" stroke="#FFFFFF" strokeWidth="3.2" />
        <path d="M25 24.5L30.5 30" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="19" cy="18" r="2.8" fill="#34D399" />
      </svg>
    </div>
  );
});

export default AppLogo;
