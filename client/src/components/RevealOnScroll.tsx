import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { useSite } from "../lib/site";

export type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade" | "rotate";
export const VARIANTS: Record<RevealVariant, { hidden: any; show: any }> = {
  up: { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -28 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -44 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 44 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } },
  rotate: { hidden: { opacity: 0, y: 30, rotate: -4 }, show: { opacity: 1, y: 0, rotate: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
};
const EASE = [0.2, 0.7, 0.2, 1];

/** Respects the OS "reduce motion" setting and the admin's site-wide animation switch. */
export function useMotionEnabled() {
  const SITE = useSite();
  const reduce = useReducedMotion();
  return !reduce && SITE.animation.enabled !== false;
}

export default function RevealOnScroll({ children, delay = 0, y, variant = "up", className = "", once = true }: { children: ReactNode; delay?: number; y?: number; variant?: RevealVariant; className?: string; once?: boolean }) {
  const on = useMotionEnabled();
  if (!on) return <div className={className}>{children}</div>;
  const v = y !== undefined && variant === "up" ? { hidden: { opacity: 0, y }, show: { opacity: 1, y: 0 } } : VARIANTS[variant];
  return (
    <motion.div className={className} variants={v} initial="hidden" whileInView="show" viewport={{ once, amount: 0.15 }} transition={{ duration: 0.75, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Container whose <StaggerItem> children animate in one after another. */
export function Stagger({ children, className = "", gap = 0.08, delay = 0 }: { children: ReactNode; className?: string; gap?: number; delay?: number }) {
  const on = useMotionEnabled();
  if (!on) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}>
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className = "", variant = "up" }: { children: ReactNode; className?: string; variant?: RevealVariant }) {
  const on = useMotionEnabled();
  if (!on) return <div className={className}>{children}</div>;
  return <motion.div className={className} variants={VARIANTS[variant]} transition={{ duration: 0.65, ease: EASE }}>{children}</motion.div>;
}
