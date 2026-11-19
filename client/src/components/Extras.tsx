import { useEffect, useState } from "react";
import { pub } from "../lib/api";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";
import { Quote, Trophy } from "lucide-react";

const Head = ({ tag, title }: { tag: string; title: string }) => <SectionHeading label={tag} title={title} />;
function useList<T = any>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => { pub(path).then(setItems).catch(() => setItems([])); }, [path]);
  return items;
}

export function Testimonials() {
  const items = useList<any>("/testimonials");
  if (!items.length) return null; // nothing approved yet → section hidden, no placeholder
  return (
    <section id="testimonials" className="py-28 md:py-36" style={{ background: "var(--bg-soft)" }}>
      <div className="container-x">
        <Head tag="Testimonials" title="Kind words." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <RevealOnScroll key={t.id} delay={(i % 3) * 0.06}>
              <figure className="card p-6 h-full">
                <Quote size={18} style={{ color: "var(--crimson)" }} />
                <blockquote className="my-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t.feedback}</blockquote>
                <figcaption className="flex items-center gap-3">
                  {t.avatar?.url && <img src={t.avatar.url} alt="" width={40} height={40} loading="lazy" style={{ borderRadius: 999, objectFit: "cover", width: 40, height: 40 }} />}
                  <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs" style={{ color: "var(--text-faint)" }}>{[t.position, t.company].filter(Boolean).join(", ")}</p></div>
                </figcaption>
              </figure>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Achievements() {
  const items = useList<any>("/achievements");
  if (!items.length) return null;
  return (
    <section id="achievements" className="py-24">
      <div className="container-x">
        <Head tag="Achievements" title="Milestones." />
        <ul className="grid sm:grid-cols-2 gap-5" style={{ listStyle: "none", padding: 0 }}>
          {items.map((a) => (
            <li key={a.id} className="card p-5 flex gap-4"><Trophy size={20} style={{ color: "var(--crimson)", flexShrink: 0 }} />
              <div><p className="font-semibold text-sm">{a.title} {a.dateLabel && <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>· {a.dateLabel}</span>}</p>
                {a.description && <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{a.description}</p>}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Gallery() {
  const [data, setData] = useState<{ albums: any[]; images: any[] }>({ albums: [], images: [] });
  const [album, setAlbum] = useState("all");
  const [open, setOpen] = useState<any | null>(null);
  useEffect(() => { pub("/gallery").then(setData).catch(() => {}); }, []);
  if (!data.images.length) return null;
  const shown = album === "all" ? data.images : data.images.filter((i) => i.album === album);
  return (
    <section id="gallery" className="py-28">
      <div className="container-x">
        <Head tag="Gallery" title="Moments." />
        {data.albums.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {[{ id: "all", title: "All" }, ...data.albums].map((a) => (
              <button key={a.id} onClick={() => setAlbum(a.id)} className={`filter-chip ${album === a.id ? "active" : ""}`} data-cursor>{a.title}</button>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {shown.map((g) => (
            <button key={g.id} onClick={() => setOpen(g)} className="card overflow-hidden text-left" aria-label={g.caption || "Open image"}>
              <img src={g.media?.url} alt={g.caption || g.media?.altText || ""} loading="lazy" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
              {g.caption && <p className="p-3 text-xs" style={{ color: "var(--text-muted)" }}>{g.caption}</p>}
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="modal-backdrop" style={{ position: "fixed", inset: 0, zIndex: 90, display: "grid", placeItems: "center", padding: 20 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <img src={open.media?.url} alt={open.caption || ""} style={{ maxWidth: "100%", maxHeight: "88vh", borderRadius: 12 }} />
        </div>
      )}
    </section>
  );
}
