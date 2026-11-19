import { Github, Linkedin, Mail, ArrowUp, Heart } from "lucide-react";
import { useSite, visibleNav, NAV_LABELS } from "../lib/site";
import NepalFlag from "./NepalFlag";
import PrayerFlags from "./PrayerFlags";

export default function Footer() {
  const SITE = useSite();
  const items = visibleNav(SITE.homepage).filter((s) => s !== "home");
  const socials = [{ href: SITE.socials.github, Icon: Github, label: "GitHub" }, { href: SITE.socials.linkedin, Icon: Linkedin, label: "LinkedIn" }, { href: SITE.socials.email, Icon: Mail, label: "Email" }].filter((s) => s.href);
  return (
    <footer className="force-dark relative" style={{ background: "linear-gradient(180deg,#3A0715,#1d0a10)", borderTop: "3px solid var(--gold)" }}>
      {SITE.theme.patterns !== false && <div className="opacity-80"><PrayerFlags count={22} /></div>}
      <div className="container-x pt-14 pb-8">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 mb-10 text-center md:text-left">
          <div className="max-w-sm mx-auto md:mx-0">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4"><NepalFlag /><span className="font-display text-xl font-semibold">{SITE.name}</span></div>
            <p className="text-sm leading-relaxed" style={{ color: "#E6D3CC" }}>{SITE.footerBlurb}</p>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-xs mb-4" style={{ color: "var(--gold)" }}>explore</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm max-w-xs mx-auto md:mx-0 text-left">
              {items.map((id) => <a key={id} href={`/#${id}`} className="hover:text-[var(--gold)] transition-colors" style={{ color: "#F1E2D8" }}>{NAV_LABELS[id]}</a>)}
            </div>
          </nav>
        </div>
        <div className="rounded-3xl md:rounded-[999px] px-4 md:px-8 py-4 md:py-3 grid md:grid-cols-[auto_1fr_auto] items-center gap-4" style={{ background: "linear-gradient(90deg,#8f0d27,#DC143C,#8f0d27)", border: "1px solid rgba(212,175,55,.7)" }}>
          <div className="flex gap-2 justify-center">
            {socials.map(({ href, Icon, label }) => (
              <a key={label} href={href} aria-label={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:-translate-y-1" style={{ background: "rgba(58,7,21,.55)", border: "1px solid rgba(212,175,55,.7)" }}><Icon size={15} /></a>
            ))}
          </div>
          {SITE.footerTagline && <p className="text-center font-display italic text-lg flex items-center justify-center gap-3" style={{ color: "#F3D77A" }}><span className="hidden sm:block h-px w-12" style={{ background: "#D4AF37" }} />{SITE.footerTagline}<span className="hidden sm:block h-px w-12" style={{ background: "#D4AF37" }} /></p>}
          <p className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs italic" style={{ border: "1px solid rgba(212,175,55,.7)", background: "rgba(58,7,21,.55)" }}><Heart size={12} fill="#DC143C" color="#DC143C" /> Proud to be Nepali <NepalFlag /></p>
        </div>
        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono" style={{ color: "#CDB9B2" }}>
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn btn-gold" style={{ padding: "7px 14px" }} aria-label="Back to top"><ArrowUp size={14} /> Top</button>
        </div>
      </div>
    </footer>
  );
}
