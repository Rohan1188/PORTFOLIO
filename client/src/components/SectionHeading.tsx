import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useMotionEnabled } from "./RevealOnScroll";

/** Shared section heading: italic red label, drawing gold rule, word-by-word title reveal. */
export default function SectionHeading({ label, title, center = false, compact = false, className = "", children }: { label: string; title: string; center?: boolean; compact?: boolean; className?: string; children?: ReactNode }) {
  const on = useMotionEnabled();
  const words = title.split(" ");
  return (
    <div className={`${compact ? "mb-6" : "mb-10 md:mb-14"} flex flex-col md:flex-row md:items-end md:justify-between gap-6 ${className}`}>
      <div className={center ? "text-center mx-auto" : "max-w-2xl"}>
        <motion.p className={`font-display italic text-xl md:text-2xl mb-2 flex items-center gap-3 ${center ? "justify-center" : ""}`} style={{ color: "var(--crimson)" }}
          initial={on ? { opacity: 0, x: -20 } : false} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.6 }}>
          {label}
          <motion.span aria-hidden="true" className="block h-[2px] rounded" style={{ background: "var(--grad-gold)", width: 70, transformOrigin: "left center" }}
            initial={on ? { scaleX: 0 } : false} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.8, delay: 0.25 }} />
        </motion.p>
        <motion.h2 className="font-display font-semibold" style={{ fontSize: "clamp(1.8rem,3.6vw,2.8rem)", lineHeight: 1.12 }}
          initial={on ? "hidden" : false} whileInView="show" viewport={{ once: true, amount: 0.8 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}>
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: "0.12em", marginRight: "0.28em" }}>
              <motion.span className="inline-block" variants={{ hidden: { y: "110%" }, show: { y: 0 } }} transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}>{w}</motion.span>
            </span>
          ))}
        </motion.h2>
      </div>
      {children}
    </div>
  );
}
