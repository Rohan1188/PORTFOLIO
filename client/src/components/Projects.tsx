import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Github, ExternalLink, X, ArrowRight } from "lucide-react";
import { useSite } from "../lib/site";
import { Project } from "../lib/types";
import SectionHeading from "./SectionHeading";
import { Stagger, StaggerItem } from "./RevealOnScroll";

/** Cover image, or a Nepal-lattice placeholder with the project's initials until one is uploaded in the admin. */
function Thumb({ p }: { p: Project }) {
  if (p.image) return <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
  const initials = p.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
  return (
    <div className="relative w-full h-full overflow-hidden transition-transform duration-700 group-hover:scale-110" style={{ background: "linear-gradient(135deg,#3A0715,#8f0d27 60%,#B5121B)" }}>
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true"><defs><pattern id={`lat-${initials}`} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M0 18 L18 0 L36 18 L18 36 Z" fill="none" stroke="#D4AF37" strokeOpacity=".28" /><circle cx="18" cy="18" r="1.6" fill="#D4AF37" fillOpacity=".5" /></pattern></defs><rect width="100%" height="100%" fill={`url(#lat-${initials})`} /></svg>
      <span className="absolute inset-0 flex items-center justify-center font-display font-bold" style={{ fontSize: "clamp(2.2rem,6vw,3.4rem)", color: "#F3D77A", textShadow: "0 4px 18px rgba(0,0,0,.45)" }}>{initials}</span>
    </div>
  );
}

export default function Projects() {
  const SITE = useSite();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const list = filter === "All" ? SITE.projects : SITE.projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-28 md:py-36">
      <div className="container-x">
        <SectionHeading label="Projects" title="Selected work.">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
            {SITE.projectCategories.map((c) => (
              <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)} data-cursor className={`filter-chip ${filter === c ? "active" : ""}`}>{c}</button>
            ))}
          </div>
        </SectionHeading>

        <Stagger key={filter} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" gap={0.09}>
          {list.map((p) => (
            <StaggerItem key={p.name} className="h-full">
              <div className="card p-0 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden group cursor-pointer" onClick={() => setSelected(p)} data-cursor role="button" tabIndex={0} aria-label={`View details of ${p.name}`}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(p)}>
                  <Thumb p={p} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" style={{ background: "rgba(58,7,21,.55)" }}>
                    <span className="btn btn-primary text-xs">View Details</span>
                  </div>
                  <span className="tag absolute top-3 left-3" style={{ background: "var(--bg)", opacity: 0.95 }}>{p.category}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-lg mb-1.5 font-semibold">{p.name}</h3>
                  <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">{p.tech.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-auto">
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-70" data-cursor><Github size={14} /> Code</a>}
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-70" data-cursor><ExternalLink size={14} /> Live Demo</a>}
                    {p.slug && <Link to={`/projects/${p.slug}`} className="flex items-center gap-1.5 ml-auto font-medium" style={{ color: "var(--crimson)" }} data-cursor>Details <ArrowRight size={14} /></Link>}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-7 md:p-9"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="tag mb-2 inline-block">{selected.category}</span>
                  <h3 className="font-display text-2xl font-semibold">{selected.name}</h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <X size={14} />
                </button>
              </div>
              <div
                className="aspect-[16/9] rounded-xl mb-6"
                style={{ background: "linear-gradient(135deg, var(--surface-2), var(--surface))" }}
              />
              <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                {selected.long}
              </p>
              <div className="flex flex-wrap gap-2 mb-7">
                {selected.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {selected.github && (<a href={selected.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  View Code
                </a>)}
                {selected.demo && (<a href={selected.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Live Demo
                </a>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
