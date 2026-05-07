import React from "react";

const KranokOrnament = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 220 220"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="kranokGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FCE6A8" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#E6BC4A" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C9962B" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <g
      fill="none"
      stroke="url(#kranokGold)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer flame curl */}
      <path d="M10 10 C 30 10, 60 20, 80 50 C 95 75, 100 105, 95 135 C 90 160, 70 180, 40 195" />
      {/* Inner spiral */}
      <path d="M16 16 C 34 16, 58 28, 72 52 C 84 73, 86 100, 80 125 C 74 148, 60 168, 38 180" />
      {/* Lai Thai tongue */}
      <path d="M22 22 C 40 28, 56 44, 60 70 C 62 88, 56 105, 44 116 C 36 124, 28 128, 24 128" />
      {/* Tip flourish */}
      <path d="M30 32 C 42 38, 50 50, 50 66 C 50 78, 44 86, 36 90" />
      {/* Decorative dots */}
      <circle cx="14" cy="14" r="2" fill="url(#kranokGold)" stroke="none" />
      <circle cx="50" cy="50" r="1.5" fill="url(#kranokGold)" stroke="none" />
      <circle cx="78" cy="100" r="1.5" fill="url(#kranokGold)" stroke="none" />
      <circle cx="48" cy="160" r="1.5" fill="url(#kranokGold)" stroke="none" />
      {/* Curling tendrils */}
      <path d="M70 18 C 80 28, 84 40, 80 52" />
      <path d="M105 48 C 116 60, 120 76, 114 92" />
      <path d="M100 130 C 112 138, 120 150, 118 166" />
    </g>
  </svg>
);

const LotusDivider = () => (
  <svg
    className="intro__divider-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="currentColor">
      <path d="M12 3 C 13 7, 13 10, 12 13 C 11 10, 11 7, 12 3 Z" opacity="0.95" />
      <path d="M5 8 C 8 9, 10 11, 12 13 C 9 13, 7 12, 5 8 Z" opacity="0.85" />
      <path d="M19 8 C 16 9, 14 11, 12 13 C 15 13, 17 12, 19 8 Z" opacity="0.85" />
      <path d="M3 14 C 7 14, 10 14, 12 14 C 10 16, 6 16, 3 14 Z" opacity="0.7" />
      <path d="M21 14 C 17 14, 14 14, 12 14 C 14 16, 18 16, 21 14 Z" opacity="0.7" />
      <circle cx="12" cy="13" r="1.4" />
    </g>
  </svg>
);

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="intro__bg" aria-hidden="true" />
        <div className="intro__overlay-warm" aria-hidden="true" />
        <div className="intro__overlay-pattern" aria-hidden="true" />
        <div className="intro__overlay-vignette" aria-hidden="true" />
        <div className="intro__glow" aria-hidden="true" />

        <div className="intro__particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="intro__particle" />
          ))}
        </div>

        <KranokOrnament className="intro__ornament intro__ornament--tl" />
        <KranokOrnament className="intro__ornament intro__ornament--tr" />
        <KranokOrnament className="intro__ornament intro__ornament--bl" />
        <KranokOrnament className="intro__ornament intro__ornament--br" />

        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-10 col-md-offset-1 intro-text">
                <span className="intro__eyebrow">
                  Wat Dan · Rama III · Bangkok
                </span>
                <h1>
                  {props.data ? props.data.title : "วัดด่าน พระราม 3"}
                  <span></span>
                </h1>
                <div className="intro__divider" aria-hidden="true">
                  <LotusDivider />
                </div>
                <p>
                  {props.data && props.data.paragraph
                    ? props.data.paragraph
                    : "วัดเก่าแก่ริมฝั่งแม่น้ำเจ้าพระยา · มรดกแห่งศรัทธาตั้งแต่สมัยอยุธยาตอนปลาย"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#features"
          className="intro__scroll page-scroll"
          aria-label="เลื่อนลงเพื่อดูเพิ่มเติม"
        >
          <span>เลื่อนลง</span>
          <span className="intro__scroll-line" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
};
