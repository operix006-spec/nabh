'use client';

import React from 'react';
import { CognitiveRadarData } from '@/types/cognitive';
import { useLanguage } from '@/context/LanguageContext';

interface CognitiveRadarChartProps {
  data: CognitiveRadarData[];
  size?: number;
  showBenchmark?: boolean;
}

export const CognitiveRadarChart: React.FC<CognitiveRadarChartProps> = ({
  data,
  size = 420,
  showBenchmark = true,
}) => {
  const { language } = useLanguage();

  const center = size / 2;
  const radius = (size / 2) * 0.72;
  const totalAxes = data.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Concentric polygon rings (levels 20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (valueNormalized: number, index: number) => {
    // Start angle at top (-PI / 2)
    const angle = index * angleStep - Math.PI / 2;
    const x = center + radius * valueNormalized * Math.cos(angle);
    const y = center + radius * valueNormalized * Math.sin(angle);
    return { x, y };
  };

  // User polygon points
  const userPoints = data
    .map((item, i) => {
      const coords = getCoordinates(item.score / 100, i);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  // Benchmark polygon points
  const benchmarkPoints = data
    .map((item, i) => {
      const coords = getCoordinates(item.benchmarkScore / 100, i);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible drop-shadow-md"
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="userPolygonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Circular background glow */}
        <circle cx={center} cy={center} r={radius} fill="url(#radarGlow)" />

        {/* Concentric grid webs */}
        {levels.map((lvl, idx) => {
          const ringPoints = data
            .map((_, i) => {
              const { x, y } = getCoordinates(lvl, i);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={`ring-${idx}`}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray={idx === levels.length - 1 ? 'none' : '3 3'}
              className="text-border/60"
            />
          );
        })}

        {/* Axis Spokes from center to rim */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(1, i);
          return (
            <line
              key={`spoke-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border/70"
            />
          );
        })}

        {/* Benchmark Polygon (Peer Average) */}
        {showBenchmark && (
          <polygon
            points={benchmarkPoints}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-70"
          />
        )}

        {/* User Performance Polygon */}
        <polygon
          points={userPoints}
          fill="url(#userPolygonGrad)"
          stroke="#6366F1"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out filter drop-shadow-sm"
        />

        {/* Vertex Markers & Data Callouts */}
        {data.map((item, i) => {
          const coords = getCoordinates(item.score / 100, i);
          const labelCoords = getCoordinates(1.22, i);
          const label = language === 'ar' ? item.nameAr : item.nameEn;

          return (
            <g key={`vertex-${item.domain}`} className="group cursor-pointer">
              {/* Point Node */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="5"
                fill={item.color}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-transform group-hover:scale-150 duration-200"
              />

              {/* Axis Title Label */}
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-bold fill-foreground"
              >
                {label}
              </text>

              {/* Score Value Tag */}
              <text
                x={labelCoords.x}
                y={labelCoords.y + (labelCoords.y > center ? 14 : -14)}
                textAnchor="middle"
                className="text-[10px] font-mono font-extrabold"
                fill={item.color}
              >
                {item.score}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs font-semibold text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary shadow-sm" />
          <span>{language === 'ar' ? 'مستواك الحالي' : 'Your Cognitive Score'}</span>
        </div>
        {showBenchmark && (
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-slate-400" />
            <span>{language === 'ar' ? 'المتوسط العمري' : 'Peer Average'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
