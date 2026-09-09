'use client';

import React from 'react';

interface MascotProps {
  expression?: 'happy' | 'excited' | 'studious' | 'celebrating' | 'curious';
  size?: number;
  className?: string;
}

/**
 * 1. NEURO BRAIN MASCOT (Apple Glass x Duolingo Playfulness)
 */
export const NeuroBrainMascot: React.FC<MascotProps> = ({
  expression = 'happy',
  size = 120,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          {/* Main Brain Body Gradient */}
          <linearGradient id="brainGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          {/* Cheerful Pink Cheek Gradient */}
          <radialGradient id="cheekGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>

          {/* Specular Highlight Gradient */}
          <linearGradient id="specularGrad" x1="60" y1="30" x2="140" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Golden Crown / Halo for celebrating */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Ambient Halo Glow */}
        <circle cx="100" cy="100" r="85" fill="#6366F1" fillOpacity="0.12" filter="blur(10px)" />

        {/* Brain Left Hemisphere Lobes */}
        <path
          d="M75 160 C40 160 25 130 30 100 C20 80 35 45 65 50 C70 30 100 35 100 55 C100 55 100 155 75 160 Z"
          fill="url(#brainGrad)"
        />

        {/* Brain Right Hemisphere Lobes */}
        <path
          d="M125 160 C160 160 175 130 170 100 C180 80 165 45 135 50 C130 30 100 35 100 55 C100 55 100 155 125 160 Z"
          fill="url(#brainGrad)"
        />

        {/* Gyri & Sulci (Curved neural grooves) */}
        <path
          d="M45 90 Q65 80 60 110 Q75 125 65 140"
          stroke="#4338CA"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M155 90 Q135 80 140 110 Q125 125 135 140"
          stroke="#4338CA"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M60 65 Q80 75 75 90"
          stroke="#4338CA"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M140 65 Q120 75 125 90"
          stroke="#4338CA"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Specular 3D Gloss Sheen on Left & Right Apex */}
        <ellipse cx="65" cy="60" rx="20" ry="12" fill="url(#specularGrad)" transform="rotate(-25 65 60)" />
        <ellipse cx="135" cy="60" rx="20" ry="12" fill="url(#specularGrad)" transform="rotate(25 135 60)" />

        {/* Cute Cheeks */}
        <circle cx="58" cy="122" r="14" fill="url(#cheekGrad)" />
        <circle cx="142" cy="122" r="14" fill="url(#cheekGrad)" />

        {/* EYES */}
        {expression === 'happy' || expression === 'curious' ? (
          <>
            {/* Big Expressive Anime/Duolingo Eyes */}
            <circle cx="76" cy="105" r="11" fill="#1E1B4B" />
            <circle cx="124" cy="105" r="11" fill="#1E1B4B" />
            {/* Highlights */}
            <circle cx="73" cy="101" r="4.5" fill="#FFFFFF" />
            <circle cx="78" cy="107" r="2" fill="#FFFFFF" />
            <circle cx="121" cy="101" r="4.5" fill="#FFFFFF" />
            <circle cx="126" cy="107" r="2" fill="#FFFFFF" />
          </>
        ) : expression === 'celebrating' || expression === 'excited' ? (
          <>
            {/* Joyful Closed Arched Eyes (^_^)) */}
            <path d="M66 108 Q76 96 86 108" stroke="#1E1B4B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M114 108 Q124 96 134 108" stroke="#1E1B4B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Studious/Focused Gaze with Smart Glasses */}
            <circle cx="76" cy="105" r="15" stroke="#0F172A" strokeWidth="4" fill="#FFFFFF" fillOpacity="0.3" />
            <circle cx="124" cy="105" r="15" stroke="#0F172A" strokeWidth="4" fill="#FFFFFF" fillOpacity="0.3" />
            <path d="M91 105 L109 105" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
            <circle cx="76" cy="105" r="6" fill="#1E1B4B" />
            <circle cx="124" cy="105" r="6" fill="#1E1B4B" />
          </>
        )}

        {/* MOUTH */}
        {expression === 'celebrating' || expression === 'excited' ? (
          /* Wide open happy smile */
          <path
            d="M85 125 Q100 145 115 125 Q100 132 85 125 Z"
            fill="#EF4444"
            stroke="#1E1B4B"
            strokeWidth="3"
          />
        ) : (
          /* Gentle cheerful smile */
          <path
            d="M88 126 Q100 138 112 126"
            stroke="#1E1B4B"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* SPARK / SYNAPSE ANTENNAS */}
        <path d="M95 38 L93 20" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="93" cy="16" r="6" fill="#F59E0B" className="animate-pulse" />
        <path d="M105 38 L107 20" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="107" cy="16" r="6" fill="#10B981" className="animate-pulse" />

        {/* Celebrating Floating Star */}
        {expression === 'celebrating' && (
          <path
            d="M100 5 L104 14 L114 15 L106 22 L109 31 L100 26 L91 31 L94 22 L86 15 L96 14 Z"
            fill="url(#goldGrad)"
            stroke="#D97706"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
};

/**
 * 2. 3D APPLE-GLASS MASTERY TROPHY ILLUSTRATION
 */
export const MasteryTrophyIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 160,
  className = '',
}) => {
  return (
    <div style={{ width: size, height: size }} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="cupGold" x1="50" y1="40" x2="150" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="pedestalGrad" x1="60" y1="150" x2="140" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
        </defs>

        {/* Pedestal Base */}
        <rect x="55" y="165" width="90" height="20" rx="8" fill="url(#pedestalGrad)" />
        <rect x="70" y="150" width="60" height="18" rx="4" fill="#4338CA" />
        <path d="M90 125 L110 125 L106 150 L94 150 Z" fill="#D97706" />

        {/* Trophy Cup */}
        <path
          d="M50 45 C50 115 85 130 100 130 C115 130 150 115 150 45 Z"
          fill="url(#cupGold)"
        />

        {/* Inner Cup Shading */}
        <ellipse cx="100" cy="45" rx="50" ry="12" fill="#FBBF24" />
        <ellipse cx="100" cy="45" rx="42" ry="8" fill="#B45309" opacity="0.6" />

        {/* Trophy Handles */}
        <path
          d="M50 55 C25 55 25 95 54 102"
          stroke="#F59E0B"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M150 55 C175 55 175 95 146 102"
          stroke="#F59E0B"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Embossed Star in Center */}
        <path
          d="M100 70 L104 80 L115 81 L106 88 L109 98 L100 92 L91 98 L94 88 L85 81 L96 80 Z"
          fill="#FFFFFF"
          className="drop-shadow-md"
        />
      </svg>
    </div>
  );
};

/**
 * 3. SYNAPTIC NEURAL CIRCUIT NODE
 */
export const SynapticCircuitIllustration: React.FC<{ size?: number; className?: string }> = ({
  size = 140,
  className = '',
}) => {
  return (
    <div style={{ width: size, height: size }} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Connection Lines */}
        <line x1="100" y1="100" x2="40" y2="50" stroke="#6366F1" strokeWidth="3" strokeDasharray="6 6" />
        <line x1="100" y1="100" x2="160" y2="50" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="6 6" />
        <line x1="100" y1="100" x2="40" y2="150" stroke="#10B981" strokeWidth="3" strokeDasharray="6 6" />
        <line x1="100" y1="100" x2="160" y2="150" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 6" />

        {/* Central Hub Node */}
        <circle cx="100" cy="100" r="28" fill="#6366F1" fillOpacity="0.2" className="animate-ping" />
        <circle cx="100" cy="100" r="22" fill="#6366F1" />
        <circle cx="100" cy="100" r="10" fill="#FFFFFF" />

        {/* Peripheral Synapses */}
        <circle cx="40" cy="50" r="14" fill="#818CF8" />
        <circle cx="160" cy="50" r="14" fill="#A78BFA" />
        <circle cx="40" cy="150" r="14" fill="#34D399" />
        <circle cx="160" cy="150" r="14" fill="#FBBF24" />
      </svg>
    </div>
  );
};
