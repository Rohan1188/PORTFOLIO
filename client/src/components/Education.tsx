import { GraduationCap } from "lucide-react";
import { useSite } from "../lib/site";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function Education() {
  const SITE = useSite();
  return (
    <section id="education" className="py-28 md:py-36" style={{ background: "var(--bg-soft)" }}>
      <div className="container-x">
        <RevealOnScroll className="mb-16 max-w-xl">
          <>
            <SectionHeading label="Education" title="Where it started." />
          </>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {SITE.education.map((ed, i) => (
            <RevealOnScroll key={ed.degree} delay={i * 0.08} className="card p-7">
              <>
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap size={18} color="var(--crimson)" />
                  <p className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                    {ed.year}
                  </p>
                </div>
                <h3 className="font-display text-lg mb-1 font-semibold">{ed.degree}</h3>
                <p className="text-sm mb-4" style={{ color: "var(--blue)" }}>
                  {ed.institution} · {ed.location}
                </p>
                <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                    coursework —{" "}
                  </span>
                  {ed.coursework}
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                    achievement —{" "}
                  </span>
                  {ed.achievement}
                </p>
              </>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
