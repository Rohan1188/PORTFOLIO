/** Newari-lattice inspired section divider. */
export default function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <svg viewBox="0 0 400 20" width="100%" height="20" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="newari" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 L10 0 L20 10 L10 20 Z M20 10 L30 0 L40 10 L30 20 Z" fill="none" stroke="var(--crimson)" strokeOpacity=".35" strokeWidth="1" />
            <circle cx="10" cy="10" r="1.6" fill="var(--blue)" fillOpacity=".5" /><circle cx="30" cy="10" r="1.6" fill="var(--blue)" fillOpacity=".5" />
          </pattern>
        </defs>
        <rect width="400" height="20" fill="url(#newari)" />
      </svg>
    </div>
  );
}
