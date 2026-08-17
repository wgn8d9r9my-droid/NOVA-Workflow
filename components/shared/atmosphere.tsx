export function Atmosphere() {
  return (
    <div className="atmosphere grain" aria-hidden>
      <svg
        className="atmosphere-scene"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="amb-base" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#0e1013" />
            <stop offset="55%" stopColor="#0a0b0d" />
            <stop offset="100%" stopColor="#07080a" />
          </linearGradient>
          <radialGradient id="amb-sun" cx="82%" cy="6%" r="55%">
            <stop offset="0%" stopColor="#ffcf94" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#e8a862" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e8a862" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="amb-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2a1c" stopOpacity="0" />
            <stop offset="35%" stopColor="#3a2a1c" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1c130c" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="amb-lens" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#4a5560" />
            <stop offset="55%" stopColor="#1a1e23" />
            <stop offset="100%" stopColor="#050607" />
          </radialGradient>
          <radialGradient id="amb-vignette" cx="50%" cy="18%" r="75%">
            <stop offset="40%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
          </radialGradient>
          <filter id="amb-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="amb-blur-med" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="amb-blur-heavy" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* base wall */}
        <rect width="1440" height="900" fill="url(#amb-base)" />
        <rect width="1440" height="900" fill="url(#amb-sun)" />

        {/* Scene objects sit mostly behind the app sidebar (softened by its
            frosted glass) and only lightly graze the open hero-text gutter,
            so they read as depth rather than competing with foreground UI. */}
        <g transform="translate(10, 30)">
          {/* framed poster — DISCIPLINE / FOCUS / FREEDOM */}
          <g filter="url(#amb-blur-soft)" opacity="0.45">
            <rect x="70" y="70" width="230" height="300" rx="4" fill="#111319" stroke="#2c303b" strokeWidth="2" />
            <text x="185" y="185" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" letterSpacing="2" fill="#c7cad2">
              DISCIPLINE
            </text>
            <text x="185" y="225" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" letterSpacing="2" fill="#c7cad2">
              FOCUS
            </text>
            <text x="185" y="265" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" letterSpacing="2" fill="#c7cad2">
              FREEDOM
            </text>
          </g>

          {/* smaller framed poster — EXECUTION */}
          <g filter="url(#amb-blur-med)" opacity="0.35">
            <rect x="90" y="430" width="190" height="150" rx="4" fill="#111319" stroke="#2c303b" strokeWidth="2" />
            <text x="185" y="512" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" letterSpacing="2" fill="#b8bbc3">
              EXECUTION
            </text>
          </g>

          {/* plant — layered blurred leaves */}
          <g filter="url(#amb-blur-med)" fill="var(--atmosphere-plant, #33553f)" opacity="0.85">
            <path d="M -20 900 C 40 780, 10 620, 70 480 C 90 560, 60 700, 40 900 Z" />
            <path d="M 30 900 C 90 760, 60 560, 130 380 C 150 500, 110 680, 90 900 Z" />
            <path d="M 90 900 C 140 720, 150 540, 220 340 C 230 480, 190 660, 160 900 Z" />
            <path d="M -20 700 C 20 640, 10 560, 60 500 C 55 570, 40 650, 10 720 Z" />
          </g>

          {/* camera body + lens, foreground bokeh */}
          <g filter="url(#amb-blur-heavy)" opacity="0.9">
            <rect x="40" y="620" width="260" height="160" rx="22" fill="#14171b" />
            <rect x="120" y="580" width="90" height="50" rx="8" fill="#14171b" />
            <circle cx="185" cy="700" r="88" fill="url(#amb-lens)" />
            <circle cx="185" cy="700" r="88" fill="none" stroke="#3a4048" strokeWidth="3" />
            <circle cx="150" cy="665" r="18" fill="#7c8894" opacity="0.35" />
          </g>
        </g>

        {/* desk surface */}
        <rect x="0" y="620" width="1440" height="280" fill="url(#amb-desk)" />

        {/* vignette */}
        <rect width="1440" height="900" fill="url(#amb-vignette)" />
      </svg>
    </div>
  );
}
