import { motion } from "framer-motion";
import { useSite } from "../lib/site";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  const SITE = useSite();
  return (
    <section id="experience" className="py-28 md:py-36">
      <div className="container-x">
        <RevealOnScroll className="mb-16 max-w-xl">
          <>
            <SectionHeading label="Experience" title="Where I've worked." />
          </>
        </RevealOnScroll>

        <div className="relative max-w-3xl">
          <motion.div className="absolute left-[7px] top-2 bottom-2 w-[2px]" style={{ background: "linear-gradient(var(--gold), var(--crimson-fill))", transformOrigin: "top" }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1.6, ease: "easeOut" }} />
          {SITE.experience.map((e, i) => (
            <RevealOnScroll key={e.company} delay={i * 0.05} className="relative pl-10 pb-14 last:pb-0">
              <>
                <span
                  className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full pulse-dot"
                  style={{ background: "var(--bg)", border: "2px solid var(--crimson)" }}
                />
                <p className="font-mono text-xs mb-2" style={{ color: "var(--text-faint)" }}>
                  {e.start} — {e.end}
                </p>
                <h3 className="font-display text-xl mb-1 font-semibold">{e.role}</h3>
                <p className="text-sm mb-4" style={{ color: "var(--blue)" }}>
                  {e.company} · {e.location}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {e.points.map((p) => (
                    <li key={p} className="text-sm flex gap-2" style={{ color: "var(--text-muted)" }}>
                      <span style={{ color: "var(--crimson)" }}>—</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {e.tech.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
