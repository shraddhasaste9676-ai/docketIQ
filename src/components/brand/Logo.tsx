import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showTagline = false 
}) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon: Restrained connected document timeline mark */}
      <div className={`relative flex items-center justify-center rounded bg-[#0F2547] text-white shadow-xs ${iconSizes[size]}`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" strokeWidth="2">
          {/* Document outline */}
          <path d="M5 4C5 2.89543 5.89543 2 7 2H13L19 8V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4Z" stroke="currentColor" strokeWidth="1.5" />
          {/* Timeline node trace */}
          <line x1="9" y1="9" x2="9" y2="17" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="11" r="1.5" fill="#38BDF8" />
          <circle cx="9" cy="16" r="1.5" fill="#2DD4BF" />
          {/* Passage lines */}
          <line x1="12" y1="11" x2="16" y2="11" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="16" x2="15" y2="16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className={`tracking-tight text-[#0F172A] font-sans flex items-center ${textSizes[size]}`}>
          <span>Docket</span>
          <span className="text-[#0F2547] ml-0.5 font-extrabold">IQ</span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
            From Docket to Action
          </span>
        )}
      </div>
    </div>
  );
};
