const COLORS = ["#2f5fd0", "#f5f5f5", "#dc143c", "#2e9a57", "#f2c230"]; // traditional order: blue, white, red, green, yellow
/** A string of prayer flags swaying with a pure-CSS animation (stops under reduced motion). */
export default function PrayerFlags({ count = 15 }: { count?: number }) {
  return (
    <div className="prayer-flags" aria-hidden="true">
      <svg viewBox={`0 0 ${count * 40} 46`} preserveAspectRatio="none" width="100%" height="46">
        <path d={`M0 4 Q ${count * 20} 18 ${count * 40} 4`} fill="none" stroke="var(--border)" strokeWidth="1.5" />
        {Array.from({ length: count }, (_, i) => {
          const x = 8 + i * 40, y = 4 + 14 * Math.sin((Math.PI * (x + 12)) / (count * 40));
          return <rect key={i} x={x} y={y} width="24" height="20" rx="2" fill={COLORS[i % 5]} opacity=".85" className="pf" style={{ animationDelay: `${(i % 5) * 0.35}s`, transformOrigin: `${x + 12}px ${y}px` }} />;
        })}
      </svg>
    </div>
  );
}
