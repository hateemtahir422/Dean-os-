import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-7 h-7 rounded-lg'
      : size === 'lg'
      ? 'w-9 h-9 rounded-xl'
      : 'w-8 h-8 rounded-xl';

  const iconSizeClasses =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div
      aria-hidden="true"
      className={`${sizeClasses} bg-[#EBF4EE] border border-[#BCDDC7] flex items-center justify-center text-[#3D684A] shadow-2xs shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconSizeClasses}
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.9"
        />
        <path
          d="M7.5 8.5H16.5M12 8.5V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="15.5" r="1.5" fill="#4A7C59" />
      </svg>
    </div>
  );
};
