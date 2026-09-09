'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function Floating3DBrain({ className = '' }: { className?: string }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -y * 0.04,
      y: x * 0.04,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center select-none cursor-pointer perspective-[1000px] ${className}`}
    >
      {/* Ambient Multi-Stop Radial Glows */}
      <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[#6C63FF]/30 via-[#8B5CF6]/20 to-[#00E5A8]/20 blur-3xl -z-10 animate-pulse" />
      <div className="absolute w-72 h-72 rounded-full bg-[#6C63FF]/20 blur-2xl -z-10" />

      <motion.div
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          y: [0, -12, 0],
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 100, damping: 15 },
          rotateY: { type: 'spring', stiffness: 100, damping: 15 },
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center transform-gpu"
      >
        {/* Orbital Ring 1: Synaptic Axis Alpha */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-[#6C63FF]/30 [transform:rotateX(65deg)_rotateZ(20deg)]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00E5A8] shadow-[0_0_12px_#00E5A8]" />
        </motion.div>

        {/* Orbital Ring 2: Synaptic Axis Beta */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border border-[#8B5CF6]/30 [transform:rotateY(60deg)_rotateX(25deg)]"
        >
          <div className="absolute bottom-0 right-1/4 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
        </motion.div>

        {/* Glassmorphic 3D Vector Neuro-Brain SVG */}
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-[0_20px_40px_rgba(108,99,255,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brainMeshGrad" x1="20" y1="20" x2="220" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6C63FF" />
              <stop offset="0.45" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#00E5A8" />
            </linearGradient>

            <linearGradient id="innerGlowGrad" x1="60" y1="40" x2="180" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="0.3" stopColor="#A78BFA" stopOpacity="0.4" />
              <stop offset="1" stopColor="#6C63FF" stopOpacity="0.1" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Hemisphere Lobe */}
          <path
            d="M 115 45 C 95 45 75 55 65 72 C 52 90 50 115 58 135 C 64 150 75 162 88 172 C 98 180 110 185 115 190 Z"
            fill="url(#brainMeshGrad)"
            fillOpacity="0.85"
            stroke="url(#innerGlowGrad)"
            strokeWidth="2.5"
            filter="url(#softGlow)"
          />

          {/* Right Hemisphere Lobe */}
          <path
            d="M 125 45 C 145 45 165 55 175 72 C 188 90 190 115 182 135 C 176 150 165 162 152 172 C 142 180 130 185 125 190 Z"
            fill="url(#brainMeshGrad)"
            fillOpacity="0.92"
            stroke="url(#innerGlowGrad)"
            strokeWidth="2.5"
            filter="url(#softGlow)"
          />

          {/* Central Neural Synaptic Bridge (Corpus Callosum fissure) */}
          <path
            d="M 120 48 L 120 188"
            stroke="#00E5A8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 6"
            className="animate-pulse"
          />

          {/* Cortical Sulci & Synaptic Bridges (Left) */}
          <path
            d="M 72 85 Q 92 88 105 80"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 66 118 Q 88 122 108 112"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 76 148 Q 95 145 106 142"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cortical Sulci & Synaptic Bridges (Right) */}
          <path
            d="M 168 85 Q 148 88 135 80"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 174 118 Q 152 122 132 112"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 164 148 Q 145 145 134 142"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Active Synaptic Spark Orbs */}
          <circle cx="92" cy="86" r="4" fill="#00E5A8" className="animate-ping" />
          <circle cx="92" cy="86" r="3" fill="#FFFFFF" />

          <circle cx="154" cy="116" r="4" fill="#00E5A8" className="animate-ping" />
          <circle cx="154" cy="116" r="3" fill="#FFFFFF" />

          <circle cx="106" cy="142" r="3.5" fill="#6C63FF" />
          <circle cx="138" cy="78" r="3.5" fill="#00E5A8" />
          <circle cx="80" cy="116" r="3.5" fill="#FFFFFF" />
        </svg>

        {/* Floating Cognitive Domain Badge 1: Memory */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 -left-3 px-3 py-1.5 rounded-2xl glass-pill flex items-center gap-1.5 shadow-lg border border-white/50 text-xs font-bold text-foreground"
        >
          <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" />
          <span>الذاكرة • Memory</span>
        </motion.div>

        {/* Floating Cognitive Domain Badge 2: Speed / DDA */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-2xl glass-pill flex items-center gap-1.5 shadow-lg border border-white/50 text-xs font-bold text-foreground"
        >
          <span className="w-2 h-2 rounded-full bg-[#00E5A8] shadow-[0_0_8px_#00E5A8]" />
          <span>السرعة • 210ms</span>
        </motion.div>

        {/* Floating Cognitive Domain Badge 3: 50 Skills */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 -right-8 -translate-y-1/2 px-2.5 py-1 rounded-xl glass-pill text-[11px] font-mono font-bold text-primary shadow-md border border-primary/20"
        >
          50 Skills • CHC
        </motion.div>
      </motion.div>
    </div>
  );
}
