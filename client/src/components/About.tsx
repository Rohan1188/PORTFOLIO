import { useEffect, useState } from "react";
import { useSite } from "../lib/site";
import { pub } from "../lib/api";
import RevealOnScroll from "./RevealOnScroll";
import { Skyline, PostcardStupa, PrayerWheel, FlowerCluster } from "./Decor";
import NepalFlag from "./NepalFlag";
import { Target, Eye, Heart, ArrowRight, Briefcase } from "lucide-react";

export default function About() {
  const SITE = useSite();
  const [photos, setPhotos] = useState<{ url: string; alt: string }[]>([]);
  const [more, setMore] = useState(false);
  useEffect(() => { pub("/gallery").then((g) => setPhotos(g.images.slice(0, 2).map((i: any) => ({ url: i.media?.url, alt: i.caption || i.media?.altText || "" })).filter((p: any) => p.url))).catch(() => {}); }, []);
  const [first, ...rest] = SITE.bio;
  const jobs = SITE.experience.slice(0, 4);
  const polaroid = { border: "5px solid #fff", borderRadius: 14, boxShadow: "0 18px 40px -16px rgba(58,7,21,.55)", overflow: "hidden", background: "#fff" } as const;

  return (
    <section id="about" className="relative pt-24 pb-28 overflow-hidden">
      <Skyline className="absolute left-0 right-0 bottom-0 w-full h-[110px] md:h-[150px]" />
      {SITE.theme.patterns !== false && <>
        <PrayerWheel className="hidden 2xl:block" style={{ right: -10, top: 110, width: 100 }} />
        <FlowerCluster className="hidden 2xl:block" style={{ right: -10, bottom: 20, width: 170 }} />
      </>}

      <div className="container-x relative grid gap-12 lg:grid-cols-2 xl:grid-cols-[0.85fr_1fr_1fr] items-start">
        {/* collage */}
        <RevealOnScroll>
          <div className="relative mx-auto w-full" style={{ maxWidth: 400, height: 360 }}>
            <div className="absolute" style={{ ...polaroid, left: 0, top: 10, width: "66%", height: 250, transform: "rotate(-6deg)", zIndex: 1 }}>
              {photos[0] ? <img src={photos[0].url} alt={photos[0].alt} loading="lazy" className="w-full h-full object-cover" /> : <PostcardStupa />}
            </div>
            <div className="absolute" style={{ ...polaroid, right: 0, top: 70, width: "52%", height: 290, transform: "rotate(5deg)", zIndex: 2 }}>
              <img src={photos[1]?.url ?? SITE.profileImage} alt={photos[1]?.alt ?? `${SITE.name}`} loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: "50% 20%" }} />
            </div>
          </div>
        </RevealOnScroll>

        {/* about */}
        <div className="min-w-0">
          <RevealOnScroll>
            <>
              <p className="font-display italic text-2xl mb-3 flex items-center gap-3" style={{ color: "var(--crimson)" }}>About Me <span className="h-px flex-1" style={{ background: "var(--crimson)", opacity: 0.5, maxWidth: 120 }} /></p>
              <h2 className="font-display font-bold mb-4" style={{ fontSize: "clamp(1.7rem,3vw,2.4rem)", lineHeight: 1.15 }}>
                {SITE.aboutHeadline || `Developer from ${SITE.location}`} <NepalFlag />
              </h2>
            </>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {first && <p>{first}</p>}
              {more && rest.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </RevealOnScroll>
          <div className="flex flex-wrap gap-3 mt-6">
            {rest.length > 0 && <button className="btn btn-primary" onClick={() => setMore((m) => !m)} aria-expanded={more} data-cursor>{more ? "Show less" : "Learn More"} <ArrowRight size={15} /></button>}
            <a href="#contact" className="btn btn-outline" data-cursor>Let&apos;s talk</a>
          </div>
        </div>

        {/* work experience preview */}
        {jobs.length > 0 && (
          <div className="min-w-0 lg:col-span-2 xl:col-span-1 xl:pl-8 xl:border-l" style={{ borderColor: "var(--border)" }}>
            <RevealOnScroll>
              <a href="#experience" className="font-display italic text-2xl mb-5 flex items-center gap-3" style={{ color: "var(--crimson)" }} data-cursor>Work Experience <span className="h-px flex-1" style={{ background: "var(--crimson)", opacity: 0.5, maxWidth: 90 }} /><ArrowRight size={16} /></a>
            </RevealOnScroll>
            <div role="list" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {jobs.map((j, i) => (
                <RevealOnScroll key={`${j.company}-${j.role}`} delay={i * 0.06}>
                  <div role="listitem" className="card flex gap-3 p-4 h-full" style={{ borderLeft: "4px solid var(--crimson-fill)" }}>
                    <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--grad-red)", color: "#fff", border: "2px solid var(--gold)" }}><Briefcase size={16} /></span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug break-words">{j.role}</p>
                      <p className="text-sm break-words" style={{ color: "var(--text-muted)" }}>{j.company}</p>
                      <p className="font-mono text-[11px] mt-1" style={{ color: "var(--blue)" }}>{j.start} – {j.end}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        )}
      </div>

      {(SITE.mission || SITE.vision || SITE.values.length > 0) && (
        <div className="container-x relative mt-14 grid sm:grid-cols-2 gap-4">
          {[{ t: "Mission", v: SITE.mission, I: Target }, { t: "Vision", v: SITE.vision, I: Eye }].filter((x) => x.v).map(({ t, v, I }) => (
            <div key={t} className="card p-5"><I size={18} style={{ color: "var(--crimson)" }} /><h3 className="font-display font-semibold mt-2 mb-1">{t}</h3><p className="text-sm" style={{ color: "var(--text-muted)" }}>{v}</p></div>))}
          {SITE.values.length > 0 && <div className="sm:col-span-2 flex flex-wrap gap-2">{SITE.values.map((v) => <span key={v} className="tag"><Heart size={11} style={{ display: "inline", color: "var(--crimson)", marginRight: 4 }} />{v}</span>)}</div>}
        </div>
      )}
    </section>
  );
}
