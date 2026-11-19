/** Slowly rotating mandala, decorative background for sections. */
export default function Mandala({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={`spin-slow pointer-events-none absolute ${className}`} style={{ color: "var(--gold-2)", opacity: 0.12, ...style }}>
      <g fill="none" stroke="currentColor" strokeWidth=".6">
        {[92, 76, 58, 38].map((r) => <circle key={r} cx="100" cy="100" r={r} />)}
        {Array.from({ length: 16 }, (_, i) => <path key={i} d="M100 8 Q112 40 100 62 Q88 40 100 8Z" transform={`rotate(${i * 22.5} 100 100)`} />)}
        {Array.from({ length: 8 }, (_, i) => <path key={i} d="M100 62 L108 80 L100 98 L92 80Z" transform={`rotate(${i * 45} 100 100)`} />)}
      </g>
    </svg>
  );
}
