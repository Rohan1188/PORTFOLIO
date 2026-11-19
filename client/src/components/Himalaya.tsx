import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/** Layered Himalayan ridgelines (Everest / Annapurna-inspired) with scroll parallax. Decorative only. */
export default function Himalaya() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const far = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 40]);
  const mid = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 90]);
  const near = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 150]);
  return (
    <div aria-hidden="true" className="himalaya">
      <motion.svg style={{ y: far }} viewBox="0 0 1440 360" preserveAspectRatio="none" className="himalaya-layer" fill="var(--blue)" opacity=".10">
        <path d="M0 360 L0 230 L120 170 L210 215 L330 110 L420 70 L520 150 L640 95 L760 190 L880 120 L1010 205 L1130 140 L1250 200 L1360 160 L1440 190 L1440 360 Z" />
        <path d="M420 70 L452 108 L420 100 L396 112 Z" fill="#fff" opacity=".7" />
      </motion.svg>
      <motion.svg style={{ y: mid }} viewBox="0 0 1440 360" preserveAspectRatio="none" className="himalaya-layer" fill="var(--blue)" opacity=".14">
        <path d="M0 360 L0 270 L140 215 L260 250 L400 170 L520 235 L660 160 L780 240 L920 185 L1060 250 L1200 195 L1320 245 L1440 215 L1440 360 Z" />
      </motion.svg>
      <motion.svg style={{ y: near }} viewBox="0 0 1440 360" preserveAspectRatio="none" className="himalaya-layer" fill="var(--crimson)" opacity=".08">
        <path d="M0 360 L0 310 L180 275 L330 300 L520 262 L700 305 L880 270 L1060 305 L1240 280 L1440 305 L1440 360 Z" />
      </motion.svg>
    </div>
  );
}
