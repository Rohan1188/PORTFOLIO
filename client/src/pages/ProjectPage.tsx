import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pub } from "../lib/api";
import { useSeo } from "../lib/site";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import NotFound from "./NotFound";

export default function ProjectPage() {
  const { slug } = useParams();
  const [p, setP] = useState<any | null | false>(null);
  useEffect(() => { setP(null); pub(`/projects/${slug}`).then(setP).catch(() => setP(false)); }, [slug]);
  useSeo(p ? p.name : undefined, p ? p.summary : undefined, p?.cover?.url);
  if (p === false) return <NotFound />;
  return (
    <>
      <Nav />
      <main id="main-content" className="container-x pt-36 pb-24" style={{ maxWidth: 820 }}>
        {!p ? <p>Loading…</p> : (
          <article>
            <Link to="/#projects" className="text-sm" style={{ color: "var(--crimson)" }}>← All projects</Link>
            <h1 className="font-display font-semibold mt-4 mb-3" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>{p.name}</h1>
            <p className="mb-6" style={{ color: "var(--text-muted)" }}>{p.summary}</p>
            {p.cover?.url && <img src={p.cover.url} alt={p.name} style={{ width: "100%", borderRadius: 14, marginBottom: 24 }} />}
            <p className="leading-relaxed whitespace-pre-line mb-8">{p.description}</p>
            {[["Problem", p.problem], ["Solution", p.solution], ["Outcome", p.outcome]].filter(([, v]) => v).map(([k, v]) => (
              <section key={k as string} className="mb-6"><h2 className="font-display text-xl font-semibold mb-2">{k}</h2><p style={{ color: "var(--text-muted)" }}>{v}</p></section>
            ))}
            <div className="flex flex-wrap gap-2 my-6">{p.tech?.map((t: string) => <span key={t} className="tag">{t}</span>)}</div>
            <div className="flex gap-3">
              {p.demoUrl && <a className="btn btn-primary" href={p.demoUrl} target="_blank" rel="noopener noreferrer">Live site</a>}
              {p.githubUrl && <a className="btn btn-outline" href={p.githubUrl} target="_blank" rel="noopener noreferrer">Source</a>}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
