import React from 'react';

interface BrandLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', theme = 'dark', size = 'md' }: BrandLogoProps) {
  const isLight = theme === 'light';
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-base', dot: 'w-1.5 h-1.5' },
    md: { icon: 'w-8 h-8', text: 'text-xl', dot: 'w-2 h-2' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', dot: 'w-2.5 h-2.5' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Orange Ring Icon */}
      <div
        className={`relative ${sizeClasses.icon} rounded-full border-[3px] border-[#F15A24] flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        <div className={`${sizeClasses.dot} rounded-full bg-[#F15A24]`} />
      </div>

      <span
        className={`font-extrabold tracking-tight ${sizeClasses.text} ${
          isLight ? 'text-[#1A1A1A]' : 'text-white'
        }`}
      >
        Hairdrama
      </span>
    </div>
  );
}
