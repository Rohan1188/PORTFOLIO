/**
 * Nepal's double-pennant flag: crimson field, deep-blue border, white crescent moon (upper) and sun (lower).
 * Drawn as a single SVG so it scales with font size (`1em` tall). The outline follows the flag's non-rectangular shape.
 */
export default function NepalFlag({ className = "flag-np" }: { className?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className={className} viewBox="0 0 90 108" aria-hidden="true" role="img">
      <path d="M4 3 L4 105 L62 105 L28 60 L62 60 L4 3 Z" fill="#DC143C" stroke="#003893" strokeWidth="5" strokeLinejoin="round" />
      {/* moon */}
      <path d="M17 30 a9 9 0 1 0 14 7 a7 7 0 1 1 -14 -7 Z" fill="#fff" transform="translate(-1 -4)" />
      {/* sun */}
      <g transform="translate(19 82)" fill="#fff">
        <circle r="5.2" />
        {rays.map((a) => (<path key={a} d="M0 -9.6 L1.9 -6 L-1.9 -6 Z" transform={`rotate(${a})`} />))}
      </g>
    </svg>
  );
}
