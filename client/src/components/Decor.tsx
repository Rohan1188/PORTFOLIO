/** Decorative Nepal motifs (inline SVG, no image downloads). All aria-hidden. */
import NepalFlag from "./NepalFlag";

export function Flower({ x, y, r = 22, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy={-r * 0.62} rx={r * 0.42} ry={r * 0.62} fill="#DC143C" stroke="#8f0d27" strokeWidth=".8" transform={`rotate(${a})`} />)}
      <circle r={r * 0.2} fill="#F3D77A" />
      {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx="0" cy={-r * 0.34} r={r * 0.05} fill="#8a6a12" transform={`rotate(${a})`} />)}
    </g>
  );
}

/** Rhododendron / blossom branch for the hero's top-left corner */
export function Branch({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 300 220" aria-hidden="true" className="absolute pointer-events-none hidden md:block" style={{ top: 64, [flip ? "right" : "left"]: 0, width: 200, transform: flip ? "scaleX(-1)" : undefined, opacity: 0.95 }}>
      <path d="M-10 20 Q90 30 150 90 T290 150" fill="none" stroke="#4a1a14" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 36 Q90 80 80 120" fill="none" stroke="#4a1a14" strokeWidth="4" strokeLinecap="round" />
      {[[36, 40, 20, 10], [96, 62, 24, 40], [150, 92, 22, 70], [80, 118, 20, 20], [205, 118, 18, 100], [260, 148, 16, 30], [120, 40, 14, 15], [60, 90, 14, 60]].map(([x, y, r, rot], i) => <Flower key={i} x={x} y={y} r={r} rot={rot} />)}
    </svg>
  );
}

export function FlowerCluster({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 180 150" aria-hidden="true" className={`absolute pointer-events-none ${className}`} style={style}>
      <path d="M20 150 Q60 100 100 110 T170 60" fill="none" stroke="#2f5a2a" strokeWidth="5" />
      {[[40, 112, 24, 0], [98, 96, 28, 30], [150, 70, 24, 60], [70, 140, 18, 10], [128, 124, 20, 50]].map(([x, y, r, rot], i) => <Flower key={i} x={x} y={y} r={r} rot={rot} />)}
      {[[18, 120, -30], [118, 80, 20], [60, 96, 60]].map(([x, y, a], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="6" fill="#3d6b32" transform={`rotate(${a} ${x} ${y})`} />)}
    </svg>
  );
}

export function PrayerWheel({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 150 230" aria-hidden="true" className={`absolute pointer-events-none ${className}`} style={style}>
      <defs><linearGradient id="pw" x1="0" x2="1"><stop offset="0" stopColor="#8f0d27" /><stop offset=".45" stopColor="#E8283F" /><stop offset="1" stopColor="#7d0e1f" /></linearGradient></defs>
      <rect x="62" y="0" width="26" height="22" fill="#C49A32" /><path d="M40 40 Q75 -6 110 40 Z" fill="#D4AF37" />
      <rect x="18" y="40" width="114" height="150" rx="10" fill="url(#pw)" stroke="#D4AF37" strokeWidth="4" />
      <rect x="18" y="56" width="114" height="8" fill="#D4AF37" /><rect x="18" y="166" width="114" height="8" fill="#D4AF37" />
      <text x="75" y="102" textAnchor="middle" fill="#F3D77A" fontSize="21" fontFamily="serif">ॐ मणि पद्मे</text>
      <text x="75" y="134" textAnchor="middle" fill="#F3D77A" fontSize="21" fontFamily="serif">हूँ ॐ मणि</text>
      <rect x="30" y="190" width="90" height="20" rx="4" fill="#C49A32" />
    </svg>
  );
}

/** Soft temple skyline used behind content bands */
export function Skyline({ className = "" }: { className?: string }) {
  const T = ({ x, s = 1, n = 3 }: { x: number; s?: number; n?: number }) => (
    <g transform={`translate(${x} 100) scale(${s})`} fill="currentColor">
      <rect x="-14" y="-20" width="28" height="20" />
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${-24 + i * 4} ${-20 - i * 18} L${-10 + i * 2} ${-34 - i * 18} H${10 - i * 2} L${24 - i * 4} ${-20 - i * 18} Z`} />)}
      <rect x="-1" y={-20 - n * 18 - 18} width="2" height="16" />
    </g>
  );
  return (
    <svg viewBox="0 0 900 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true" className={`pointer-events-none ${className}`} style={{ color: "rgba(220,20,60,.16)" }}>
      {[40, 130, 220, 330, 430, 530, 640, 730, 830].map((x, i) => <T key={x} x={x} s={0.9 + (i % 3) * 0.25} n={2 + (i % 3)} />)}
      <path d="M0 100 L150 70 L260 90 L420 56 L560 84 L700 62 L900 92 V100 Z" fill="currentColor" opacity=".7" />
    </svg>
  );
}

/** Illustrated "postcards" shown when no gallery photos are uploaded yet */
export function PostcardStupa() {
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="pcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b6fb0" /><stop offset=".7" stopColor="#9fc3e6" /><stop offset="1" stopColor="#f6d9b0" /></linearGradient></defs>
      <rect width="300" height="220" fill="url(#pcs)" />
      <path d="M0 150 L50 110 L90 135 L140 85 L190 130 L240 100 L300 140 V220 H0Z" fill="#dfe8f2" opacity=".85" />
      <path d="M40 200 Q150 70 260 200 Z" fill="#fff8f0" /><rect x="132" y="80" width="36" height="22" fill="#D4AF37" /><path d="M138 80 L150 30 L162 80Z" fill="#D4AF37" />
      {[[150, 30, 40, 70], [150, 30, 270, 90], [150, 30, 20, 100], [150, 30, 290, 60]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} L${c} ${d}`} stroke={["#2f5fd0", "#fff", "#DC143C", "#2e9a57", "#f2c230"][i % 5]} strokeWidth="2" strokeDasharray="6 3" />)}
      <rect x="0" y="196" width="300" height="24" fill="#c9b79a" />
    </svg>
  );
}
export function PostcardPagoda() {
  return (
    <svg viewBox="0 0 220 280" className="w-full h-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs><radialGradient id="pcp" cx=".5" cy=".4" r=".7"><stop offset="0" stopColor="#F3D77A" /><stop offset="1" stopColor="#8f0d27" /></radialGradient></defs>
      <rect width="220" height="280" fill="url(#pcp)" />
      <circle cx="110" cy="110" r="52" fill="#DC143C" stroke="#D4AF37" strokeWidth="4" /><circle cx="110" cy="112" r="34" fill="#F3D77A" /><circle cx="110" cy="112" r="14" fill="#8f0d27" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d="M110 50 l6 -22 l6 22Z" fill="#D4AF37" transform={`rotate(${i * 30} 110 110)`} />)}
      <path d="M30 280 Q110 190 190 280Z" fill="#3A0715" />
      <path d="M60 280 L60 230 Q110 205 160 230 L160 280Z" fill="#7d0e1f" stroke="#D4AF37" strokeWidth="2" />
    </svg>
  );
}
export { NepalFlag };
