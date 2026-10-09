import React from 'react';

interface ScaleWithSnakeIconProps {
  className?: string;
  snakeColor?: string;
  snakeBackColor?: string;
  scaleColor?: string;
  cutoutColor?: string;
  featherColor?: string;
  featherQuillColor?: string;
  heartColor?: string;
  heartHighlightColor?: string;
}

/**
 * ScaleWithSnakeIcon:
 * Balanced scales of justice with a golden serpent tightly coiled around the central spine.
 * Features a delicate feather of truth in one pan, and a heart in the other pan (weighing reason, conscience, and truth).
 * 
 * Features realistic 3D spiral winding:
 * - Back coils render behind the spine
 * - The central column passes through each loop
 * - Front coils wrap across the front with distinct layer priority
 * - Crowned serpent head arches attentively over the top fulcrum
 * - Feather on the left scale pan
 * - Heart on the right scale pan
 */
export const ScaleWithSnakeIcon: React.FC<ScaleWithSnakeIconProps> = ({
  className = 'w-5 h-5',
  snakeColor = '#FBBF24', // amber-400
  snakeBackColor = '#D97706', // amber-600 for realistic shadow behind column
  scaleColor = 'currentColor',
  cutoutColor,
  featherColor = '#38BDF8', // sky-400 / cyan feather of truth
  featherQuillColor = '#E0F2FE', // soft quill stem
  heartColor = '#F43F5E', // rose-500 / crimson heart
  heartHighlightColor = '#FDA4AF', // soft rose gleam
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 
        LAYER 1: BACK COILS OF THE SERPENT (Passes behind the central spine)
        Curving from right (x=14.4) behind the pillar to left (x=9.6)
      */}
      <g id="snake-coils-back">
        {/* Lower coil - behind spine */}
        <path
          d="M14.4 16.8 C14.0 15.8 10.0 15.5 9.6 14.8"
          stroke={snakeBackColor}
          strokeWidth="1.65"
          strokeLinecap="round"
        />
        {/* Mid coil - behind spine */}
        <path
          d="M14.4 12.2 C14.0 11.2 10.0 10.9 9.6 10.2"
          stroke={snakeBackColor}
          strokeWidth="1.65"
          strokeLinecap="round"
        />
        {/* Upper coil - behind spine beneath crossbeam */}
        <path
          d="M14.4 7.6 C14.0 6.6 10.0 6.3 9.7 5.6"
          stroke={snakeBackColor}
          strokeWidth="1.65"
          strokeLinecap="round"
        />
      </g>

      {/* 
        LAYER 2: SCALE STRUCTURE (Base, Central Spine, Crossbeam, Pans)
      */}
      <g id="scale-structure">
        {/* Balanced base pedestal */}
        <path
          d="M8.5 21H15.5"
          stroke={scaleColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Central vertical spine / column */}
        <line
          x1="12"
          y1="4.5"
          x2="12"
          y2="20.5"
          stroke={scaleColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Top fulcrum finial / pivot point */}
        <circle cx="12" cy="3.5" r="1.4" fill={scaleColor} />

        {/* Horizontal crossbeam */}
        <line
          x1="4"
          y1="7.5"
          x2="20"
          y2="7.5"
          stroke={scaleColor}
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Left scale suspension strings */}
        <path
          d="M4 7.5L2 13.5M4 7.5L6 13.5"
          stroke={scaleColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Left pan dish */}
        <path
          d="M1 13.5C1 15.5 2.8 17 4 17C5.2 17 7 15.5 7 13.5H1Z"
          fill={scaleColor}
          fillOpacity="0.25"
          stroke={scaleColor}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Feather on Left Pan (Weighing Truth & Lightness) */}
        <g id="scale-pan-feather">
          {/* Feather vane body */}
          <path
            d="M4.0 13.2 C2.3 11.4 2.2 9.0 3.0 7.2 C4.0 8.0 5.1 10.2 4.0 13.2Z"
            fill={featherColor}
            stroke={featherColor}
            strokeWidth="0.3"
            strokeLinejoin="round"
          />
          {/* Central quill shaft */}
          <path
            d="M4.0 13.4 C3.6 11.2 3.3 9.0 3.0 7.0"
            stroke={featherQuillColor}
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          {/* Delicate feather barbs */}
          <path
            d="M3.4 9.0 L2.6 8.6 M3.6 10.4 L2.6 10.1 M3.7 11.7 L2.9 11.7"
            stroke={featherQuillColor}
            strokeWidth="0.45"
            strokeLinecap="round"
          />
        </g>

        {/* Right scale suspension strings */}
        <path
          d="M20 7.5L18 13.5M20 7.5L22 13.5"
          stroke={scaleColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Right pan dish */}
        <path
          d="M17 13.5C17 15.5 18.8 17 20 17C21.2 17 23 15.5 23 13.5H17Z"
          fill={scaleColor}
          fillOpacity="0.25"
          stroke={scaleColor}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Heart on Right Pan (Weighing Conscience & Heart) */}
        <g id="scale-pan-heart">
          <path
            d="M20.0 13.2 C18.4 11.9 17.8 10.3 18.8 9.4 C19.6 8.8 20.0 9.3 20.0 9.9 C20.0 9.3 20.4 8.8 21.2 9.4 C22.2 10.3 21.6 11.9 20.0 13.2Z"
            fill={heartColor}
            stroke={heartColor}
            strokeWidth="0.35"
            strokeLinejoin="round"
          />
          {/* Heart soft light gleam */}
          <circle cx="19.3" cy="9.9" r="0.4" fill={heartHighlightColor} />
        </g>
      </g>

      {/* 
        LAYER 3: FRONT COILS OF THE SERPENT (Passes in front of the central spine)
        Curving from left (x=9.6) across the spine to right (x=14.4)
      */}
      <g id="snake-coils-front">
        {/* Tail wrap curling around bottom pedestal */}
        <path
          d="M12.8 20.8 C11.2 21.2 9.4 20.6 9.6 19.4"
          stroke={snakeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 1. Low front coil - wraps tightly across the spine */}
        {cutoutColor && (
          <path
            d="M9.6 19.4 C10.0 18.4 14.0 17.6 14.4 16.8"
            stroke={cutoutColor}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        )}
        <path
          d="M9.6 19.4 C10.0 18.4 14.0 17.6 14.4 16.8"
          stroke={snakeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* 2. Mid front coil - wraps tightly across the spine */}
        {cutoutColor && (
          <path
            d="M9.6 14.8 C10.0 13.8 14.0 13.0 14.4 12.2"
            stroke={cutoutColor}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        )}
        <path
          d="M9.6 14.8 C10.0 13.8 14.0 13.0 14.4 12.2"
          stroke={snakeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* 3. Upper front coil - wraps tightly across the spine */}
        {cutoutColor && (
          <path
            d="M9.6 10.2 C10.0 9.2 14.0 8.4 14.4 7.6"
            stroke={cutoutColor}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        )}
        <path
          d="M9.6 10.2 C10.0 9.2 14.0 8.4 14.4 7.6"
          stroke={snakeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Neck rising across upper post towards the top fulcrum */}
        {cutoutColor && (
          <path
            d="M9.7 5.6 C10.2 4.4 12.6 3.8 13.6 3.2"
            stroke={cutoutColor}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        )}
        <path
          d="M9.7 5.6 C10.2 4.4 12.6 3.8 13.6 3.2"
          stroke={snakeColor}
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        {/* Serpent head profile perched above fulcrum */}
        <path
          d="M13.6 2.6L14.7 3.2L13.6 3.8L12.8 3.2Z"
          fill={snakeColor}
        />
        {/* Serpent eye accent */}
        <circle cx="13.7" cy="3.1" r="0.35" fill="#1C1917" />
      </g>
    </svg>
  );
};
