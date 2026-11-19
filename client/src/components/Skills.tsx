import { useState } from "react";
import { motion } from "framer-motion";
import { useSite } from "../lib/site";
import RevealOnScroll from "./RevealOnScroll";

export default function Skills() {
  const SITE = useSite();
  const [cat, setCat] = useState("All");
  if (!SITE.skills.length) return null;
  const groups = cat === "All" ? SITE.skills : SITE.skills.filter((g) => g.group === cat);
  return (
    <section id="skills" className="py-24 md:py-32" style={{ background: "var(--bg-soft)" }}>
      <div className="container-x">
        <RevealOnScroll className="mb-10 max-w-xl">
          <>
            <p className="font-display italic text-xl mb-2" style={{ color: "var(--crimson)" }}>My Skills</p>
            <div className="gold-rule mb-5" />
            <h2 className="font-display font-semibold" style={{ fontSize: "clamp(1.8rem,3.4vw,2.6rem)" }}>The tools I build with.</h2>
          </>
        </RevealOnScroll>
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Skill categories">
          {["All", ...SITE.skills.map((g) => g.group)].map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`filter-chip ${cat === c ? "active" : ""}`} data-cursor>{c}</button>
          ))}
        </div>
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g, gi) => (
            <RevealOnScroll key={g.group} delay={(gi % 3) * 0.07}>
              <div className="card p-6 h-full">
                <h3 className="font-display text-lg font-semibold mb-1">{g.group}</h3><div className="gold-rule mb-4" style={{ width: 40 }} />
                {SITE.showSkillLevels ? (
                  <ul className="space-y-3" style={{ listStyle: "none", padding: 0 }}>
                    {g.items.map((s) => (
                      <li key={s.name}><div className="flex justify-between text-sm mb-1"><span>{s.name}</span><span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>{s.level}%</span></div>
                        <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}><motion.div className="skillbar-fill h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} /></div></li>))}
                  </ul>
                ) : (
                  <div className="flex flex-wrap gap-2">{g.items.map((s) => <span key={s.name} className="tag">{s.name}</span>)}</div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
