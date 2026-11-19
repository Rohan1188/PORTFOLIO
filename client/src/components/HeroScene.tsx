import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import NepalFlag from "./NepalFlag";
import { useSite } from "../lib/site";

/** One tiered Newari-style pagoda silhouette. (x,y) = bottom centre, s = scale. */
function Pagoda({ x, y, s = 1, tiers = 3 }: { x: number; y: number; s?: number; tiers?: number }) {
  const roofs = Array.from({ length: tiers }, (_, i) => {
    const w = (150 - i * 26) * s, h = 34 * s, top = y - (52 + i * 62) * s;
    return { w, h, top, i };
  });
  return (
    <g>
      <rect x={x - 70 * s} y={y - 52 * s} width={140 * s} height={52 * s} fill="#4a0d18" />
      <rect x={x - 70 * s} y={y - 52 * s} width={140 * s} height={5 * s} fill="#D4AF37" opacity=".7" />
      {[-40, -10, 20].map((dx) => <rect key={dx} x={x + dx * s} y={y - 38 * s} width={18 * s} height={30 * s} fill="#D4AF37" opacity=".35" />)}
      {roofs.map(({ w, h, top, i }) => (
        <g key={i}>
          <path d={`M${x - w / 2 - 22 * s} ${top} Q${x - w / 2 + 6 * s} ${top - 4 * s} ${x - w / 2 + 20 * s} ${top - h} L${x + w / 2 - 20 * s} ${top - h} Q${x + w / 2 - 6 * s} ${top - 4 * s} ${x + w / 2 + 22 * s} ${top} Z`} fill="#7d0e1f" stroke="#D4AF37" strokeWidth={1.4 * s} strokeOpacity=".75" />
          <rect x={x - (w / 2 - 14 * s)} y={top} width={w - 28 * s} height={28 * s} fill="#3a0715" />
        </g>
      ))}
      <path d={`M${x} ${y - (52 + tiers * 62) * s} l${-7 * s} ${-14 * s} h${14 * s} z`} fill="#D4AF37" />
      <rect x={x - 1.5 * s} y={y - (52 + tiers * 62 + 38) * s} width={3 * s} height={26 * s} fill="#D4AF37" />
    </g>
  );
}

/** Boudhanath-style stupa silhouette */
function Stupa({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <path d={`M${x - 90 * s} ${y} Q${x} ${y - 150 * s} ${x + 90 * s} ${y} Z`} fill="#f6e7d2" opacity=".92" />
      <rect x={x - 26 * s} y={y - 150 * s} width={52 * s} height={30 * s} fill="#D4AF37" />
      <path d={`M${x - 20 * s} ${y - 150 * s} L${x} ${y - 215 * s} L${x + 20 * s} ${y - 150 * s} Z`} fill="#D4AF37" />
      <circle cx={x} cy={y - 140 * s} r={6 * s} fill="#DC143C" />
      <rect x={x - 100 * s} y={y} width={200 * s} height={10 * s} fill="#f6e7d2" opacity=".8" />
    </g>
  );
}

/** Illustrated Himalayan scene (vector, so it stays crisp and tiny). If the admin uploads a hero photo, that is used instead. */
export default function HeroScene() {
  const SITE = useSite();
  const reduce = useReducedMotion();
  const par = SITE.animation.parallax !== false && !reduce;
  const { scrollY } = useScroll();
  const yFar = useTransform(scrollY, [0, 800], [0, par ? 50 : 0]);
  const yMid = useTransform(scrollY, [0, 800], [0, par ? 110 : 0]);
  const yNear = useTransform(scrollY, [0, 800], [0, par ? 170 : 0]);
  const useBackdrop = SITE.theme.himalayanBackdrop !== false;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {SITE.heroBg ? (
        <img src={SITE.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55 }} fetchPriority="high" />
      ) : useBackdrop ? (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d0a15" /><stop offset=".45" stopColor="#5a1230" /><stop offset=".78" stopColor="#b5472f" /><stop offset="1" stopColor="#e9a653" /></linearGradient>
            <radialGradient id="glow" cx=".62" cy=".5" r=".5"><stop offset="0" stopColor="#ffd98a" stopOpacity=".75" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
            <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8566a" /><stop offset="1" stopColor="#4a1428" /></linearGradient>
            <linearGradient id="snow" gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="470"><stop offset="0" stopColor="#fff8f0" /><stop offset=".34" stopColor="#f4dccf" /><stop offset=".62" stopColor="#b9667a" /><stop offset="1" stopColor="#5b2236" /></linearGradient>
            <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4d5a2c" /><stop offset="1" stopColor="#1e2a17" /></linearGradient>
            <linearGradient id="mistg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#ffe9d6" stopOpacity=".38" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#sky)" />
          <rect width="1600" height="900" fill="url(#glow)" />
          <motion.g style={{ y: yFar }}>
            <path d="M0 470 L110 400 L210 440 L330 350 L450 420 L560 330 L700 410 L820 340 L950 420 L1080 360 L1210 430 L1340 370 L1470 430 L1600 390 V900 H0 Z" fill="#9a5568" opacity=".55" />
            <path d="M0 520 L90 470 L170 500 L260 410 L340 350 L420 380 L500 300 L560 240 L610 180 L660 120 L700 160 L740 148 L790 215 L850 255 L900 210 L960 160 L1010 210 L1060 190 L1120 250 L1190 215 L1260 300 L1340 270 L1420 340 L1500 330 L1600 400 V900 H0 Z" fill="url(#snow)" />
            <path d="M660 120 L700 160 L740 148 L790 215 L850 255 L800 330 L740 300 L700 400 L640 330 L690 240 Z" fill="#3a0715" opacity=".22" />
            <path d="M960 160 L1010 210 L1060 190 L1120 250 L1190 215 L1150 320 L1090 300 L1040 380 L990 300 L1020 230 Z" fill="#3a0715" opacity=".2" />
            <path d="M500 300 L560 240 L610 180 L660 120 L640 200 L600 250 L560 300 L530 340 Z" fill="#fff6ec" opacity=".35" />
          </motion.g>
          <g className="mist"><rect x="-120" y="470" width="1840" height="150" fill="url(#mistg)" /></g>
          <motion.g style={{ y: yMid }}>
            <path d="M0 700 L120 650 L260 690 L420 625 L560 680 L720 640 L880 690 L1040 640 L1200 695 L1380 655 L1600 700 V900 H0 Z" fill="#5b2236" opacity=".95" />
            <Stupa x={230} y={715} s={0.8} />
            <Pagoda x={1060} y={720} s={0.55} tiers={3} />
          </motion.g>
          <g className="mist b"><rect x="-120" y="640" width="1840" height="120" fill="url(#mistg)" /></g>
          <motion.g style={{ y: yNear }}>
            <path d="M0 790 Q220 730 460 775 T900 770 T1340 760 T1600 780 V900 H0 Z" fill="url(#hill)" />
            <Pagoda x={1330} y={830} s={1} tiers={3} />
            <Pagoda x={1500} y={850} s={0.8} tiers={2} />
            <Pagoda x={1160} y={850} s={0.7} tiers={2} />
          </motion.g>
        </svg>
      ) : null}
      {/* readability: darken behind the text column */}
      <div className="absolute inset-0 hero-shade" />
      {/* Nepal flag on a pole (desktop only) */}
      <div className="hidden xl:block absolute" style={{ right: "15%", top: "18%", height: "44%" }}>
        <div style={{ width: 4, height: "100%", background: "linear-gradient(#e9d28a,#8a6a12)", borderRadius: 2 }} />
        <div className="flag-wave absolute" style={{ left: 4, top: 0, fontSize: 150 }}><NepalFlag /></div>
      </div>
    </div>
  );
}
