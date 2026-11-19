import { Layers, Layout, Server, Cloud, Grid3x3, CheckCircle2 } from "lucide-react";
import { useSite } from "../lib/site";
import Mandala from "./Mandala";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

const icons = [Layers, Layout, Server, Cloud, Grid3x3, CheckCircle2];

export default function Services() {
  const SITE = useSite();
  return (
    <section id="services" className="py-28 md:py-36 relative overflow-hidden" style={{ background: "var(--bg-soft)" }}>
      <Mandala className="right-[-120px] top-10 w-[420px] hidden lg:block" />
      <div className="container-x">
        <RevealOnScroll className="mb-14 max-w-xl">
          <>
            <SectionHeading label="Services" title="What I can build for you." />
          </>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE.services.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealOnScroll key={s.title} delay={(i % 3) * 0.06} className="card p-7">
                <>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "var(--crimson-soft)" }}
                  >
                    <Icon size={19} color="var(--crimson)" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-lg mb-2 font-semibold">{s.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {s.desc}
                  </p>
                </>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
