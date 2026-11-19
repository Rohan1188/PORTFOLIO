import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { pub } from "./api";
import type { SiteConfig } from "./types";

export const NAV_SECTIONS = ["home", "about", "skills", "services", "projects", "experience", "education", "certs", "blog", "contact"] as const;
export const NAV_LABELS: Record<(typeof NAV_SECTIONS)[number], string> = { home: "Home", about: "About", skills: "Skills", services: "Services", projects: "Projects", experience: "Experience", education: "Education", certs: "Certifications", blog: "Blog", contact: "Contact" };
const HIDE_KEY: Record<string, string> = { certs: "certifications" };
/** Nav entries for sections the admin has not hidden. */
export const visibleNav = (homepage: Record<string, boolean>) => NAV_SECTIONS.filter((id) => homepage[HIDE_KEY[id] ?? id] !== false);

const EMPTY: SiteConfig = {
  name: "", role: "", location: "", email: "", phone: "", roles: [""], cvUrl: "", githubUsername: "",
  socials: { github: "", linkedin: "", email: "" }, skills: [], experience: [], education: [], projects: [], projectCategories: ["All"],
  services: [], certs: [], blog: [], stats: [], bio: [], heroIntro: "", footerBlurb: "", profileImage: "/profile-640.webp", profileCutout: "/portrait-cutout.webp", footerTagline: "", heroBg: "", aboutHeadline: "", mission: "", vision: "", values: [], showSkillLevels: false,
  homepage: {}, theme: {}, animation: {}, loaded: false,
};
const Ctx = createContext<SiteConfig>(EMPTY);
export const useSite = () => useContext(Ctx);

const yearOf = (d?: string) => (d ? String(new Date(d).getFullYear()) : "");
const mins = (html: string) => `${Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200))} min`;

/** Builds the exact shape the original components were written against, from live API data. */
async function load(): Promise<SiteConfig> {
  const [site, projects, skills, experience, education, services, certs, posts] = await Promise.all([
    pub("/site"), pub("/projects"), pub("/skills"), pub("/experience"), pub("/education"), pub("/services"), pub("/certifications"), pub("/posts"),
  ]);
  const p = site.profile ?? {}, social = site.social ?? {};
  return {
    name: p.name ?? "", role: p.designation ?? "", location: p.location ?? "", email: p.email ?? "", phone: p.phone ?? "",
    roles: site.hero?.roles?.length ? site.hero.roles : [p.designation ?? ""],
    cvUrl: p.cvUrl ?? "", githubUsername: p.githubUsername ?? "",
    socials: { github: social.github ?? "", linkedin: social.linkedin ?? "", email: social.email ?? (p.email ? `mailto:${p.email}` : "") },
    stats: site.stats?.items ?? [],
    skills: skills.map((c: any) => ({ group: c.name, items: c.items.map((s: any) => ({ name: s.name, level: s.level })) })),
    experience: experience.map((e: any) => ({ company: e.company, role: e.role, location: e.location, start: e.startLabel, end: e.endLabel, points: e.points, tech: e.tech })),
    education: education.map((e: any) => ({ degree: e.degree, institution: e.institution, location: e.location, year: e.yearLabel, coursework: e.coursework ?? "", achievement: e.achievement ?? "" })),
    projects: projects.map((x: any) => ({ image: x.cover?.url ?? "", slug: x.slug, name: x.name, category: x.category, desc: x.summary, long: x.description, tech: x.tech, github: x.githubUrl ?? "", demo: x.demoUrl ?? "" })),
    projectCategories: ["All", ...Array.from(new Set<string>(projects.map((x: any) => x.category)))],
    services: services.map((s: any) => ({ title: s.title, desc: s.description })),
    certs: certs.map((c: any) => ({ title: c.title, org: c.issuer, date: c.yearLabel, id: c.credentialId ?? "—", link: c.verifyUrl ?? c.file?.url ?? "#" })),
    blog: posts.map((b: any) => ({ slug: b.slug, title: b.title, category: b.category?.name ?? "General", date: yearOf(b.publishedAt), readTime: b.readTime || "5 min", tags: b.tags, desc: b.excerpt })),
    bio: site.about?.paragraphs ?? [], heroIntro: site.hero?.intro ?? "", footerBlurb: site.footer?.blurb ?? "",
    profileImage: p.imageUrl || "/profile-640.webp", profileCutout: p.cutoutUrl || (p.imageUrl ? "" : "/portrait-cutout.webp"), footerTagline: site.footer?.tagline ?? "Together for a Digital Nepal", heroBg: site.hero?.backgroundUrl ?? "", aboutHeadline: site.about?.headline ?? "", mission: site.about?.mission ?? "", vision: site.about?.vision ?? "", values: site.about?.values ?? [], showSkillLevels: site.homepage?.showSkillLevels === true,
    homepage: site.homepage?.sections ?? {}, theme: site.theme ?? {}, animation: site.animation ?? {}, loaded: true,
    _raw: site,
  } as SiteConfig;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteConfig>(EMPTY);
  const [error, setError] = useState(false);
  useEffect(() => { load().then(setSite).catch(() => setError(true)); }, []);
  // Admin-controlled brand colours are applied as CSS variables.
  useEffect(() => {
    const t = site.theme as any;
    const hex = /^#[0-9a-f]{6}$/i;
    if (hex.test(t?.primary ?? "")) document.documentElement.style.setProperty("--crimson-fill", t.primary);
    if (hex.test(t?.gold ?? "")) document.documentElement.style.setProperty("--gold", t.gold); // old "secondary" (blue) values are ignored on purpose
    document.documentElement.dataset.animations = site.animation?.enabled === false ? "off" : "on";
  }, [site]);
  if (error) return <div style={{ padding: 40, textAlign: "center" }}>The site could not be loaded right now. Please try again in a moment.</div>;
  return <Ctx.Provider value={site}>{children}</Ctx.Provider>;
}

/** Sets <title> and meta tags for the current page (Google renders JS; Open Graph defaults live in index.html). */
export function useSeo(title?: string, description?: string, image?: string) {
  useEffect(() => {
    if (title) document.title = title;
    const set = (sel: string, attr: string, val?: string) => { if (!val) return; let el = document.head.querySelector(sel) as HTMLMetaElement | null; if (!el) { el = document.createElement("meta"); const [k, v] = attr.split("="); el.setAttribute(k, v); document.head.appendChild(el); } el.content = val; };
    set('meta[name="description"]', "name=description", description);
    set('meta[property="og:title"]', "property=og:title", title);
    set('meta[property="og:description"]', "property=og:description", description);
    set('meta[property="og:image"]', "property=og:image", image);
  }, [title, description, image]);
}
