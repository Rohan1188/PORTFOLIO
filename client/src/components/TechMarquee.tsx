import { useSite } from "../lib/site";

/** Endless strip of your skills (from the admin's Skills list). Pauses on hover; static under reduced motion. */
export default function TechMarquee() {
  const SITE = useSite();
  const names = Array.from(new Set(SITE.skills.flatMap((g) => g.items.map((s) => s.name))));
  if (names.length < 4) return null;
  const row = (k: string) => names.map((n, i) => (
    <span key={`${k}${i}`} className="flex items-center gap-6 px-3 font-display text-lg md:text-xl whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
      {n}<span aria-hidden="true" style={{ color: "var(--gold-2)" }}>◆</span>
    </span>
  ));
  return (
    <div className="py-6 overflow-hidden" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg)" }} aria-label="Technologies I work with" role="region">
      <div className="marquee" aria-hidden="true">{row("a")}{row("b")}</div>
    </div>
  );
}
