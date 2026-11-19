
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Award } from "lucide-react";
import { useSite } from "../lib/site";
import { Certification } from "../lib/types";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function Certifications() {
  const SITE = useSite();
  const [selected, setSelected] = useState<Certification | null>(null);

  return (
    <section id="certs" className="py-28 md:py-36" style={{ background: "var(--bg-soft)" }}>
      <div className="container-x">
        <RevealOnScroll className="mb-14 max-w-xl">
          <>
            <SectionHeading label="Certifications" title="Credentials." />
          </>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE.certs.map((c, i) => (
            <RevealOnScroll key={c.title} delay={(i % 3) * 0.06}>
              <div
                className="card p-0 overflow-hidden cursor-pointer h-full"
                onClick={() => setSelected(c)}
                data-cursor
              >
                <div className="h-24 flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#3A0715,#8f0d27 70%,#B5121B)", borderBottom: "2px solid var(--gold)" }}>
                  <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: "2px solid var(--gold)", background: "rgba(58,7,21,.5)" }}><Award size={26} style={{ color: "#F3D77A" }} /></span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base mb-1 font-semibold">{c.title}</h3>
                  <p className="text-sm mb-1" style={{ color: "var(--blue)" }}>
                    {c.org}
                  </p>
                  <p className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                    {c.date}{c.id && c.id !== "—" ? ` · ID ${c.id}` : ""}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
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
              className="card w-full max-w-lg p-7 md:p-9"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <h3 className="font-display text-xl font-semibold">{selected.title}</h3>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Issued by {selected.org}
              </p>
              <p className="font-mono text-xs mb-6" style={{ color: "var(--text-faint)" }}>
                {selected.date}{selected.id && selected.id !== "—" ? ` · Credential ID ${selected.id}` : ""}
              </p>
              {selected.link && selected.link !== "#" && (<a href={selected.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Verify Credential →
              </a>)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
