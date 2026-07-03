/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeId } from '../types';

interface ShengBeiModelProps {
  side: 'flat' | 'convex';
  themeId: ThemeId;
  angle?: number; // rotation in degrees
  scale?: number;
  glow?: boolean;
  className?: string;
  isRight?: boolean; // differentiates left and right crescent cups!
}

export const ShengBeiModel: React.FC<ShengBeiModelProps> = ({
  side,
  themeId,
  angle = 0,
  scale = 1,
  glow = false,
  className = '',
  isRight = false,
}) => {
  // Determine gradient colors based on themes
  const getThemeGradients = () => {
    switch (themeId) {
      case 'cici': // 祠堂雅韵: Rich mahogany, warm temple candlelit tones
        return {
          convexStart: '#7a221a',
          convexMiddle: '#4a0c08',
          convexEnd: '#280402',
          flatBgStart: '#8f2e26',
          flatBgEnd: '#4c1511',
          ringColor: 'rgba(255, 197, 120, 0.16)',
          rimGlow: 'rgba(239, 68, 68, 0.45)',
          goldBorder: '#c48f5a',
          sideThicknessColor: '#340604',
        };
      case 'suian': // 岁安祈福: Warm bright cinnabar / warm amber terracotta
        return {
          convexStart: '#b25227',
          convexMiddle: '#7e2c0e',
          convexEnd: '#431203',
          flatBgStart: '#c96434',
          flatBgEnd: '#7a2d0b',
          ringColor: 'rgba(255, 220, 160, 0.22)',
          rimGlow: 'rgba(249, 115, 22, 0.45)',
          goldBorder: '#d9a05b',
          sideThicknessColor: '#4d1604',
        };
      case 'sitan': // 静檀沉香 (Default): Aged matte camphor black-brown, serene & luxury
      default:
        return {
          convexStart: '#4a413a',
          convexMiddle: '#2e2621',
          convexEnd: '#191513',
          flatBgStart: '#5d524a',
          flatBgEnd: '#362d27',
          ringColor: 'rgba(255, 215, 150, 0.15)',
          rimGlow: 'rgba(197, 160, 89, 0.4)',
          goldBorder: '#c5a059',
          sideThicknessColor: '#201915',
        };
    }
  };

  const colors = getThemeGradients();

  // Create unique IDs for SVG gradients to prevent collisions if multiple models are shown
  const convexGradId = `convexGrad-${themeId}-${side}-${isRight ? 'R' : 'L'}`;
  const flatGradId = `flatGrad-${themeId}-${side}-${isRight ? 'R' : 'L'}`;
  const innerRingGradId = `ringGrad-${themeId}-${side}-${isRight ? 'R' : 'L'}`;

  // Paths representing crescent moon shapes
  // Left cup curves to the left (concave belly on the right)
  // Right cup curves to the right (concave belly on the left)
  const leftPath = "M 115,15 C 60,15 25,60 25,110 C 25,160 60,205 115,205 C 85,205 75,160 75,110 C 75,60 85,15 115,15 Z";
  const rightPath = "M 85,15 C 140,15 175,60 175,110 C 175,160 140,205 85,205 C 115,205 125,160 125,110 C 125,60 115,15 85,15 Z";

  const mainPath = isRight ? rightPath : leftPath;

  // The 3D spine (central ridge along the curved back of the crescent)
  const leftSpinePath = "M 115,15 C 80,45 50,85 50,110 C 50,135 80,175 115,205";
  const rightSpinePath = "M 85,15 C 120,45 150,85 150,110 C 150,135 120,175 85,205";
  const spinePath = isRight ? rightSpinePath : leftSpinePath;

  // Center of annual rings / gold text coordinates
  const centerX = isRight ? 135 : 65;
  const centerY = 110;

  return (
    <div
      style={{
        transform: `rotate(${angle}deg) scale(${scale})`,
        transition: 'transform 0.05s ease-out',
        filter: glow ? `drop-shadow(0 0 15px ${colors.rimGlow})` : 'drop-shadow(0 12px 18px rgba(0,0,0,0.7))',
      }}
      className={`relative w-40 h-44 flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Convex Shading: 3D radial shading designed for crescent geometry */}
          <radialGradient
            id={convexGradId}
            cx={isRight ? "55%" : "45%"}
            cy="45%"
            r="65%"
            fx={isRight ? "65%" : "35%"}
            fy="35%"
          >
            <stop offset="0%" stopColor={colors.convexStart} />
            <stop offset="55%" stopColor={colors.convexMiddle} />
            <stop offset="100%" stopColor={colors.convexEnd} />
          </radialGradient>

          {/* Flat Inner Shading */}
          <linearGradient id={flatGradId} x1={isRight ? "100%" : "0%"} y1="0%" x2={isRight ? "0%" : "100%"} y2="100%">
            <stop offset="0%" stopColor={colors.flatBgStart} />
            <stop offset="65%" stopColor={colors.flatBgEnd} />
            <stop offset="100%" stopColor={colors.convexEnd} />
          </linearGradient>

          {/* Soft inner glow gradient */}
          <radialGradient id={innerRingGradId} cx={`${isRight ? 68 : 32}%`} cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="85%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.65)" />
          </radialGradient>

          {/* Soft blur for shadows/highlights */}
          <filter id="softBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {side === 'convex' ? (
          // ================= CONVEX SIDE (反面 - Curved Crescent Dome) =================
          <g>
            {/* Ambient Shadow (Soft Drop Shadow) */}
            <path
              d={mainPath}
              fill="rgba(0,0,0,0.5)"
              filter="url(#softBlur)"
              transform="translate(0, 10)"
            />

            {/* 3D Side Thickness Extrusion (makes it look like a chunky, carved solid block) */}
            <path
              d={mainPath}
              fill={colors.sideThicknessColor}
              transform="translate(0, 5)"
            />

            {/* Main Crescent Dome Body */}
            <path
              d={mainPath}
              fill={`url(#${convexGradId})`}
              stroke={colors.convexMiddle}
              strokeWidth="1.2"
            />

            {/* Highlights along the volumetric outer curve */}
            <path
              d={isRight
                ? "M 85,22 C 130,22 163,60 163,110 C 163,160 130,198 85,198"
                : "M 115,22 C 70,22 37,60 37,110 C 37,160 70,198 115,198"
              }
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.14"
              filter="url(#softBlur)"
            />



            {/* Aged, Beautifully Curved Wood Grains */}
            {isRight ? (
              <g opacity="0.28">
                <path d="M 85,25 C 112,52 128,82 128,110 C 128,138 112,168 85,195" fill="none" stroke="black" strokeWidth="1" />
                <path d="M 85,38 C 122,62 138,88 138,110 C 138,132 122,158 85,182" fill="none" stroke="black" strokeWidth="0.8" opacity="0.8" />
                <path d="M 85,50 C 132,75 148,93 148,110 C 148,127 132,145 85,170" fill="none" stroke="black" strokeWidth="0.8" opacity="0.6" />
              </g>
            ) : (
              <g opacity="0.28">
                <path d="M 115,25 C 88,52 72,82 72,110 C 72,138 88,168 115,195" fill="none" stroke="black" strokeWidth="1" />
                <path d="M 115,38 C 78,62 62,88 62,110 C 62,132 78,158 115,182" fill="none" stroke="black" strokeWidth="0.8" opacity="0.8" />
                <path d="M 115,50 C 68,75 52,93 52,110 C 52,127 68,145 115,170" fill="none" stroke="black" strokeWidth="0.8" opacity="0.6" />
              </g>
            )}

            {/* Subtle wood growth imperfections / micro texture */}
            <path
              d={isRight ? "M 150,90 L 148,130" : "M 50,90 L 52,130"}
              fill="none"
              stroke={colors.convexEnd}
              strokeWidth="1"
              opacity="0.4"
            />
          </g>
        ) : (
          // ================= FLAT SIDE (正面 - Flat split wood surface) =================
          <g>
            {/* Ambient Shadow (Soft Drop Shadow) */}
            <path
              d={mainPath}
              fill="rgba(0,0,0,0.5)"
              filter="url(#softBlur)"
              transform="translate(0, 10)"
            />

            {/* 3D Side Thickness Extrusion */}
            <path
              d={mainPath}
              fill={colors.sideThicknessColor}
              transform="translate(0, 5)"
            />

            {/* Main Flat Face */}
            <path
              d={mainPath}
              fill={`url(#${flatGradId})`}
              stroke={colors.goldBorder}
              strokeWidth="1.2"
            />

            {/* Inner Dark Vignette Shading */}
            <path
              d={mainPath}
              fill={`url(#${innerRingGradId})`}
            />

            {/* Concentric Annual Rings (年轮) beautifully centered in the meat of the crescent */}
            <circle cx={centerX} cy={centerY} r="14" fill="none" stroke={colors.ringColor} strokeWidth="1.2" />
            <circle cx={centerX} cy={centerY} r="28" fill="none" stroke={colors.ringColor} strokeWidth="1.5" />
            <circle cx={centerX} cy={centerY} r="42" fill="none" stroke={colors.ringColor} strokeWidth="1.8" />
            <circle cx={centerX} cy={centerY} r="56" fill="none" stroke={colors.ringColor} strokeWidth="1.5" />
            <circle cx={centerX} cy={centerY} r="72" fill="none" stroke={colors.ringColor} strokeWidth="1.2" />
            <circle cx={centerX} cy={centerY} r="90" fill="none" stroke={colors.ringColor} strokeWidth="1.0" />

            {/* Wood Radiating Splines (木髓射线) radiating from tree center */}
            <g opacity="0.14" stroke="black" strokeWidth="0.8">
              <line x1={centerX} y1={centerY} x2={centerX} y2={centerY - 80} />
              <line x1={centerX} y1={centerY} x2={centerX} y2={centerY + 80} />
              <line x1={centerX} y1={centerY} x2={centerX - 70} y2={centerY} />
              <line x1={centerX} y1={centerY} x2={centerX + 70} y2={centerY} />
              <line x1={centerX} y1={centerY} x2={centerX - 50} y2={centerY - 50} />
              <line x1={centerX} y1={centerY} x2={centerX + 50} y2={centerY + 50} />
              <line x1={centerX} y1={centerY} x2={centerX + 50} y2={centerY - 50} />
              <line x1={centerX} y1={centerY} x2={centerX - 50} y2={centerY + 50} />
            </g>

            {/* Center Heartwood Pith Core (树心) */}
            <ellipse cx={centerX} cy={centerY} rx="6" ry="5" fill="#1c120c" opacity="0.8" />

            {/* Gilded Calligraphy Character Accent: "吉" or "顺" in soft gold, highly traditional */}
            <text
              x={centerX}
              y={centerY + 5}
              fontFamily="Georgia, serif"
              fontSize="16"
              fontWeight="bold"
              fill={colors.goldBorder}
              opacity="0.55"
              textAnchor="middle"
              transform={`rotate(180, ${centerX}, ${centerY})`} // Since traditional divination symbols can be oriented upside down, we render nicely
            >
              {isRight ? "顺" : "吉"}
            </text>

            {/* 3D Inner Bevel edge highlighting (adds beautiful shiny edge) */}
            <path
              d={isRight
                ? "M 86,16 C 139,16 174,61 174,109 C 174,157 139,199 86,199 C 114,199 124,158 124,109 C 124,60 114,16 86,16 Z"
                : "M 114,16 C 61,16 26,61 26,109 C 26,157 61,199 114,199 C 86,199 76,158 76,109 C 76,60 86,16 114,16 Z"
              }
              fill="none"
              stroke="white"
              strokeWidth="1.2"
              opacity="0.16"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
