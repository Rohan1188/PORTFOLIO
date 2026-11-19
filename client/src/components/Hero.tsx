import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { useSite } from "../lib/site";
import HeroScene from "./HeroScene";
import PrayerFlags from "./PrayerFlags";
import { Branch, FlowerCluster } from "./Decor";

function useTypedRoles(roles: string[], enabled: boolean) {
  const [text, setText] = useState(enabled ? "" : roles[0] ?? "");
  useEffect(() => {
    if (!enabled || !roles.length) { setText(roles[0] ?? ""); return; }
    let ri = 0, ci = 0, deleting = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = roles[ri];
      if (!deleting) { ci++; setText(word.slice(0, ci)); if (ci === word.length) { deleting = true; t = setTimeout(tick, 1600); return; } }
      else { ci--; setText(word.slice(0, ci)); if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; } }
      t = setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
    return () => clearTimeout(t);
  }, [roles, enabled]);
  return text;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } } };

/** Cinematic personal-portfolio hero: text left, cut-out portrait standing in the scene on the right (no frame). */
export default function Hero() {
  const SITE = useSite();
  const reduce = useReducedMotion();
  const animated = !reduce && SITE.animation.enabled !== false;
  const typed = useTypedRoles(SITE.roles, animated);
  const cut = SITE.profileCutout;
  const longest = SITE.roles.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <section id="home" className="force-dark hero-dark relative overflow-hidden" style={{ minHeight: "min(100svh, 860px)" }}>
      <HeroScene />
      {SITE.theme.patterns !== false && <>
        <Branch />
        <FlowerCluster className="hidden md:block" style={{ left: -20, bottom: 40, width: 170, opacity: 0.9 }} />
      </>}
      {SITE.theme.patterns !== false && <div className="absolute left-0 right-0 top-[76px] opacity-60"><PrayerFlags count={22} /></div>}

      <div className="container-x relative grid lg:grid-cols-[1.05fr_0.95fr] items-end" style={{ minHeight: "inherit", paddingTop: 140 }}>
        <motion.div variants={container} initial={animated ? "hidden" : "show"} animate="show" className="pb-4 lg:pb-36 pt-4 relative z-10 self-center text-center lg:text-left">
          <motion.p variants={item} className="font-display italic mb-2" style={{ color: "var(--gold)", fontSize: "clamp(1.7rem,3.2vw,2.6rem)" }}>
            Namaste! <span aria-hidden="true">🙏</span>
          </motion.p>
          <motion.h1 variants={item} className="font-display font-bold leading-[1.04]" style={{ fontSize: "clamp(2.4rem,5.4vw,4.4rem)", color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,.45)" }}>
            I&apos;m {SITE.name}
            <span className="block mt-2 font-semibold relative" style={{ fontSize: "clamp(1.25rem,2.5vw,2rem)", lineHeight: 1.25 }} aria-label={SITE.roles.join(", ")}>
              {/* invisible copy of the longest title reserves its height, so typing never makes the page jump */}
              <span aria-hidden="true" style={{ visibility: "hidden" }}>{longest}</span>
              <span className="absolute left-0 top-0 w-full lg:text-left" style={{ background: "var(--grad-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {typed || "\u00A0"}{animated && <span className="typed-cursor" style={{ height: "0.8em", background: "var(--gold)", marginLeft: 4 }} />}
              </span>
            </span>
          </motion.h1>
          {SITE.heroIntro && <motion.p variants={item} className="max-w-[34rem] mx-auto lg:mx-0 text-base md:text-lg leading-relaxed mt-5 mb-8" style={{ color: "#F6E7DC", textShadow: "0 2px 12px rgba(0,0,0,.5)" }}>{SITE.heroIntro}</motion.p>}
          <motion.div variants={item} className="hero-actions flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href="#projects" className="btn btn-primary" style={{ border: "1px solid var(--gold)" }} data-cursor>View My Projects <ArrowRight size={16} /></a>
            {SITE.cvUrl && <a href={SITE.cvUrl} download className="btn btn-gold" data-cursor><Download size={16} /> Download Resume</a>}
            <a href="#contact" className="px-3 py-2 text-sm font-medium underline underline-offset-4 decoration-[var(--gold)]" style={{ color: "#fff" }} data-cursor>Contact Me</a>
          </motion.div>
        </motion.div>

        <motion.div className="relative justify-self-center lg:justify-self-end self-end z-[5] w-[92%] sm:w-[70%] md:w-[58%] lg:w-full max-w-[540px]" style={{ marginBottom: -2 }}
          initial={animated ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
          <div className="absolute inset-x-[8%] bottom-0 top-[10%] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,196,120,.38), transparent 72%)" }} aria-hidden="true" />
          {cut ? (
            <img src={cut} alt={`Portrait of ${SITE.name}`} width={732} height={768} fetchPriority="high" className={`relative block w-full h-auto ${animated ? "bob" : ""}`}
              style={{ filter: "drop-shadow(0 0 1.5px rgba(255,214,150,.9)) drop-shadow(0 28px 36px rgba(0,0,0,.55))", maskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)" }} />
          ) : (
            <img src={SITE.profileImage} alt={`Portrait of ${SITE.name}`} width={640} height={821} fetchPriority="high" className="relative block w-full h-auto"
              style={{ maskImage: "radial-gradient(ellipse 62% 70% at 50% 42%, #000 55%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 62% 70% at 50% 42%, #000 55%, transparent 100%)" }} />
          )}
        </motion.div>
      </div>

      {/* red ribbon + gold line flowing into the ivory page */}
      <svg viewBox="0 0 1600 140" preserveAspectRatio="none" className="absolute left-0 right-0 bottom-[-1px] w-full z-[6] pointer-events-none" style={{ height: 120 }} aria-hidden="true">
        <g className="ribbon-drift"><path d="M0 40 Q380 0 760 52 T1600 18 V140 H0 Z" fill="#8f0d27" /></g>
        <path d="M0 62 Q420 14 820 70 T1600 44 V140 H0 Z" fill="#DC143C" />
        <path d="M0 62 Q420 14 820 70 T1600 44" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
        <path d="M0 92 Q440 52 860 100 T1600 80 V140 H0 Z" fill="var(--page-bg)" />
        <path d="M0 92 Q440 52 860 100 T1600 80" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity=".8" />
      </svg>
    </section>
  );
}
