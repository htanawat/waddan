import React from "react";

const Kranok = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="thaiDriftGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FCE6A8" />
        <stop offset="60%" stopColor="#E6BC4A" />
        <stop offset="100%" stopColor="#C9962B" />
      </linearGradient>
    </defs>
    <g
      fill="none"
      stroke="url(#thaiDriftGold)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 18 C 50 22, 78 42, 92 76 C 102 100, 102 132, 88 158 C 76 178, 56 188, 32 188" />
      <path d="M30 28 C 52 32, 72 50, 80 78 C 86 100, 84 124, 72 144 C 62 158, 48 166, 36 168" />
      <path d="M40 42 C 56 48, 66 62, 68 80 C 70 96, 64 110, 54 116" />
      <circle cx="22" cy="18" r="2.2" fill="url(#thaiDriftGold)" stroke="none" />
      <circle cx="62" cy="92" r="1.8" fill="url(#thaiDriftGold)" stroke="none" />
      <circle cx="42" cy="170" r="1.8" fill="url(#thaiDriftGold)" stroke="none" />
    </g>
  </svg>
);

const Mandala = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 160 160"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <g
      fill="none"
      stroke="url(#thaiDriftGold)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="80" cy="80" r="56" strokeDasharray="2 6" opacity="0.7" />
      <circle cx="80" cy="80" r="38" strokeDasharray="3 5" opacity="0.85" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <path
          key={deg}
          d="M80 24 C 88 40, 88 60, 80 80 C 72 60, 72 40, 80 24 Z"
          transform={`rotate(${deg} 80 80)`}
          opacity="0.55"
        />
      ))}
      <circle cx="80" cy="80" r="3" fill="url(#thaiDriftGold)" stroke="none" />
    </g>
  </svg>
);

export const ScrollFxLayer = () => (
  <>
    <div className="scroll-progress-bar" aria-hidden="true" />
    <div className="thai-drift" aria-hidden="true">
      <span className="thai-drift__slot thai-drift__slot--tl parallax-y" data-parallax="0.18">
        <Kranok className="thai-drift__motif" />
      </span>
      <span className="thai-drift__slot thai-drift__slot--ml parallax-y" data-parallax="0.10">
        <Mandala className="thai-drift__motif" />
      </span>
      <span className="thai-drift__slot thai-drift__slot--bl parallax-y" data-parallax="0.22">
        <Kranok className="thai-drift__motif thai-drift__motif--flipY" />
      </span>
      <span className="thai-drift__slot thai-drift__slot--tr parallax-y" data-parallax="0.14">
        <Kranok className="thai-drift__motif thai-drift__motif--flipX" />
      </span>
      <span className="thai-drift__slot thai-drift__slot--mr parallax-y" data-parallax="0.08">
        <Mandala className="thai-drift__motif" />
      </span>
      <span className="thai-drift__slot thai-drift__slot--br parallax-y" data-parallax="0.20">
        <Kranok className="thai-drift__motif thai-drift__motif--flipBoth" />
      </span>
    </div>
  </>
);
