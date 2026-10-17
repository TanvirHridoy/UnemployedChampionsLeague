import React, { useState } from 'react';
import { Team } from '../types/tournament';

interface CrestImageProps {
  team?: Team | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallbackText?: boolean;
}

export const CrestImage: React.FC<CrestImageProps> = ({
  team,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-base',
  }[size];

  if (!team) {
    return (
      <div className={`rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 font-bold shrink-0 ${sizeClasses} ${className}`}>
        ?
      </div>
    );
  }

  // Fallback SVG Crest
  const renderFallback = () => {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-black tracking-wider uppercase shadow-md shrink-0 border border-white/20 select-none ${sizeClasses} ${className}`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${team.primaryColor || '#1e293b'}, ${team.secondaryColor || '#0f172a'})`,
          color: '#ffffff',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}
        title={team.name}
      >
        {team.shortName || team.name.slice(0, 3)}
      </div>
    );
  };

  if (!team.logo || hasError) {
    return renderFallback();
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
      <img
        src={team.logo}
        alt={team.name}
        onError={() => setHasError(true)}
        className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};
