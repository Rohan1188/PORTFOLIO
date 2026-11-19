import { Briefcase, Users, Trophy, Layers, Award, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useSite } from "../lib/site";
import Counter from "./Counter";

const ICONS = [Briefcase, Users, Trophy, Layers, Award, Sparkles];

/** Pill-shaped stats bar. Numbers come only from Admin → Website settings → Homepage statistics; the last cell is your location. */
export default function StatsBar() {
  const SITE = useSite();
  if (!SITE.stats.length && !SITE.location) return null;
  const cells = [
    ...SITE.stats.map((s, i) => ({ key: s.label, Icon: ICONS[i % ICONS.length], big: <Counter target={s.value} suffix={s.suffix ?? ""} />, small: s.label })),
    ...(SITE.location ? [{ key: "loc", Icon: MapPin, big: <>{SITE.location}</>, small: "Based in" }] : []),
  ];
  return (
    <div className="container-x relative z-10" style={{ marginTop: -44 }}>
      <motion.div className="stats-bar force-dark relative mx-auto stats-grid items-center rounded-3xl md:rounded-[999px] px-4 md:px-12 py-5 md:py-4 gap-y-5" style={{ maxWidth: 960 }}
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7 }}>
        <span aria-hidden="true" className="hidden md:block absolute left-[-9px] top-1/2 w-4 h-4 rotate-45" style={{ background: "var(--gold)", marginTop: -8 }} />
        <span aria-hidden="true" className="hidden md:block absolute right-[-9px] top-1/2 w-4 h-4 rotate-45" style={{ background: "var(--gold)", marginTop: -8 }} />
        {cells.map(({ key, Icon, big, small }, i) => (
          <div key={key} className={`flex items-center justify-center gap-3 px-2 ${i ? "md:border-l" : ""}`} style={{ borderColor: "rgba(212,175,55,.4)" }}>
            <Icon size={26} className="shrink-0" style={{ color: "var(--gold)", flexShrink: 0 }} aria-hidden="true" />
            <div className="min-w-0"><p className="font-display text-xl md:text-2xl font-semibold leading-none break-words">{big}</p><p className="text-[11px] md:text-xs mt-1" style={{ color: "#F6E7DC" }}>{small}</p></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
