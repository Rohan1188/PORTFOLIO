import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Send, Home, User, Code2, Wrench, FolderKanban, Briefcase, GraduationCap, Award, BookOpen, Mail } from "lucide-react";

const ICON: Record<string, any> = { home: Home, about: User, skills: Code2, services: Wrench, projects: FolderKanban, experience: Briefcase, education: GraduationCap, certs: Award, blog: BookOpen, contact: Mail };
import { useSite, visibleNav, NAV_LABELS } from "../lib/site";
import { useScrollSpy } from "./useScrollSpy";
import ThemeToggle from "./ThemeToggle";
import NepalFlag from "./NepalFlag";

export default function Nav() {
  const SITE = useSite();
  const { active, scrolled, progress } = useScrollSpy();
  const [open, setOpen] = useState(false);
  const items = visibleNav(SITE.homepage);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="force-dark fixed top-0 left-0 right-0 z-50 nav-glass transition-all duration-300" style={{ padding: scrolled ? "8px 0" : "14px 0" }}>
      <div className="container-x flex items-center justify-between gap-4">
        <a href="/#home" className="flex items-center gap-2.5 sm:gap-3 min-w-0" data-cursor aria-label={`${SITE.name} — home`}>
          <NepalFlag />
          <span className="leading-tight min-w-0"><span className="block font-display text-base sm:text-lg font-semibold truncate max-w-[46vw] sm:max-w-[280px]">{SITE.name}</span>
            <span className="hidden sm:block text-[11px] truncate max-w-[280px]" style={{ color: "var(--gold)" }}>{SITE.role}</span></span>
        </a>

        <nav aria-label="Primary" className="hidden xl:flex items-center gap-0.5 rounded-full px-1.5 py-1" style={{ background: "rgba(21,17,22,.35)", border: "1px solid rgba(212,175,55,.35)" }}>
          {items.map((id) => (
            <a key={id} href={`/#${id}`} data-cursor aria-current={active === id ? "true" : undefined}
              className="relative px-3 py-2 text-[13px] font-medium rounded-full transition-colors hover:text-[var(--gold)]"
              style={{ color: active === id ? "#fff" : "var(--text-muted)" }}>
              {active === id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full" style={{ background: "var(--grad-red)", border: "1px solid rgba(212,175,55,.7)" }} transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative flex items-center gap-1.5">{(() => { const I = ICON[id]; return I ? <I size={14} style={{ color: active === id ? "var(--gold)" : "inherit", opacity: 0.9 }} aria-hidden="true" /> : null; })()}{NAV_LABELS[id]}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <a href="/#contact" className="btn btn-primary hidden sm:inline-flex" style={{ padding: "9px 18px", border: "1px solid var(--gold)" }} data-cursor><Send size={14} /> Hire Me</a>
          <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-drawer" className="xl:hidden w-10 h-10 flex items-center justify-center rounded-full" style={{ border: "1px solid rgba(212,175,55,.5)" }}><Menu size={20} /></button>
        </div>
      </div>
      <div className="absolute left-0 bottom-0 h-[2px]" style={{ width: `${progress}%`, background: "var(--grad-gold)" }} aria-hidden="true" />

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-[60]" style={{ background: "rgba(21,17,22,.7)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu" className="force-dark fixed top-0 right-0 bottom-0 z-[70] w-[min(86vw,340px)] p-6 flex flex-col overflow-y-auto"
              style={{ background: "linear-gradient(180deg,#3A0715,#151116)", borderLeft: "1px solid rgba(212,175,55,.5)" }}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }}>
              <div className="flex justify-between items-center mb-6"><span className="font-display text-lg">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-10 h-10 flex items-center justify-center rounded-full" style={{ border: "1px solid rgba(212,175,55,.5)" }}><X size={18} /></button></div>
              <nav aria-label="Mobile" className="flex flex-col">
                {items.map((id, i) => (
                  <motion.a key={id} href={`/#${id}`} onClick={() => setOpen(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.03 }}
                    className="py-3 text-base flex items-center justify-between" style={{ borderBottom: "1px solid rgba(212,175,55,.2)", color: active === id ? "var(--gold)" : "#FFF8F0" }}>
                    {NAV_LABELS[id]}{active === id && <span className="w-2 h-2 rounded-full" style={{ background: "var(--crimson-fill)" }} />}
                  </motion.a>
                ))}
              </nav>
              <a href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-6 justify-center" style={{ border: "1px solid var(--gold)" }}><Send size={14} /> Hire Me</a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
