import { useEffect, useState } from "react";
import { admin } from "../lib/api";
import { MediaField, useToast } from "./ui";

type SF = { key: string; label: string; type: "text" | "textarea" | "bool" | "color" | "lines" | "paragraphs" | "image" | "file"; help?: string };
const SECTIONS: { key: string; title: string; fields?: SF[]; custom?: "stats" | "homepage" }[] = [
  { key: "profile", title: "Profile", fields: [
    { key: "name", label: "Name", type: "text" }, { key: "designation", label: "Designation", type: "text" }, { key: "imageUrl", label: "Profile image", type: "image" }, { key: "cutoutUrl", label: "Hero portrait cut-out (transparent PNG/WebP)", type: "image", help: "A photo with the background removed, so you stand inside the hero scene. If you change your profile photo, upload a new cut-out too (or leave empty to blend the normal photo)." },
    { key: "location", label: "Location", type: "text" }, { key: "email", label: "Email", type: "text" }, { key: "phone", label: "Phone", type: "text" },
    { key: "status", label: "Professional status", type: "text", help: "e.g. Open to work" }, { key: "githubUsername", label: "GitHub username", type: "text", help: "Powers the live GitHub section. Leave empty to hide it." },
    { key: "cvUrl", label: "Resume / CV (PDF)", type: "file", help: "Upload a PDF; the public Download CV buttons use it." }] },
  { key: "hero", title: "Hero", fields: [{ key: "roles", label: "Professional titles — typing animation (one per line)", type: "lines" }, { key: "intro", label: "Short professional introduction", type: "textarea" }, { key: "backgroundUrl", label: "Hero background photo (optional)", type: "image", help: "Leave empty to use the built-in illustrated Himalayan scene. Use a wide, optimised photo (WebP/JPEG)." }] },
  { key: "about", title: "About", fields: [{ key: "headline", label: "Section headline", type: "text" }, { key: "paragraphs", label: "Biography (separate paragraphs with a blank line)", type: "paragraphs" }, { key: "mission", label: "Mission", type: "textarea" }, { key: "vision", label: "Vision", type: "textarea" }, { key: "values", label: "Core values (one per line)", type: "lines" }] },
  { key: "social", title: "Social links", fields: [{ key: "github", label: "GitHub URL", type: "text" }, { key: "linkedin", label: "LinkedIn URL", type: "text" }, { key: "email", label: "Email link (mailto:…)", type: "text" }, { key: "twitter", label: "X / Twitter URL", type: "text" }] },
  { key: "stats", title: "Homepage statistics", custom: "stats" },
  { key: "homepage", title: "Section visibility", custom: "homepage" },
  { key: "theme", title: "Brand & Nepal visuals", fields: [
    { key: "primary", label: "Primary — Nepal crimson", type: "color" }, { key: "gold", label: "Accent — heritage gold", type: "color" },
    { key: "himalayanBackdrop", label: "Illustrated Himalayan hero scene", type: "bool" }, { key: "patterns", label: "Prayer flags & Newari ornaments", type: "bool" }, { key: "flagAccent", label: "Nepal flag accents", type: "bool" }] },
  { key: "animation", title: "Animation", fields: [
    { key: "enabled", label: "Enable animations site-wide", type: "bool" }, { key: "loader", label: "Loading screen", type: "bool" }, { key: "customCursor", label: "Custom cursor (desktop)", type: "bool" }, { key: "parallax", label: "Parallax mountains", type: "bool" }] },
  { key: "footer", title: "Footer", fields: [{ key: "blurb", label: "Footer blurb", type: "textarea" }, { key: "tagline", label: "Footer tagline (ribbon)", type: "text", help: "Leave empty to hide." }] },
  { key: "site", title: "Website & SEO", fields: [
    { key: "title", label: "Website title", type: "text" }, { key: "tagline", label: "Tagline", type: "text" }, { key: "url", label: "Public URL (for sitemap)", type: "text", help: "e.g. https://example.com" },
    { key: "logo", label: "Logo", type: "image" }, { key: "favicon", label: "Favicon", type: "image" }, { key: "description", label: "Default meta description", type: "textarea" }, { key: "ogImage", label: "Social share image", type: "image" }] },
];
const HOME_KEYS = ["hero", "about", "skills", "experience", "education", "projects", "services", "achievements", "resume", "certifications", "github", "gallery", "testimonials", "blog", "contact"];

export default function SettingsPage() {
  const toast = useToast();
  const [all, setAll] = useState<Record<string, any> | null>(null);
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  useEffect(() => { admin("/settings").then(setAll).catch((e) => toast(e.message, "err")); }, [toast]);
  if (!all) return <p>Loading…</p>;
  const sec = SECTIONS.find((s) => s.key === tab)!;
  const val = all[tab] ?? {};
  const set = (patch: any) => setAll({ ...all, [tab]: { ...val, ...patch } });
  const save = async () => { setSaving(true); try { await admin(`/settings/${tab}`, { method: "PUT", body: val }); toast("Saved. The public site updates immediately.", "ok"); } catch (e: any) { toast(e.message, "err"); } setSaving(false); };

  return (
    <div>
      <div className="a-head"><h1>Website settings</h1></div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>{SECTIONS.map((s) => <button key={s.key} className={`a-btn sm ${tab === s.key ? "pri" : ""}`} onClick={() => setTab(s.key)}>{s.title}</button>)}</div>
      <div className="a-card"><div className="a-form" style={{ maxWidth: 720 }}>
        {sec.fields?.map((f) => (
          <div className="a-field" key={f.key}>
            {f.type !== "bool" && <label htmlFor={`s-${f.key}`}>{f.label}</label>}
            {f.type === "text" && <input id={`s-${f.key}`} value={val[f.key] ?? ""} onChange={(e) => set({ [f.key]: e.target.value })} />}
            {f.type === "textarea" && <textarea id={`s-${f.key}`} rows={4} value={val[f.key] ?? ""} onChange={(e) => set({ [f.key]: e.target.value })} />}
            {f.type === "color" && <input id={`s-${f.key}`} type="color" style={{ width: 80, padding: 2 }} value={val[f.key] ?? "#dc143c"} onChange={(e) => set({ [f.key]: e.target.value })} />}
            {f.type === "bool" && <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 400 }}><input type="checkbox" checked={val[f.key] !== false && !!(val[f.key] ?? true)} onChange={(e) => set({ [f.key]: e.target.checked })} /> {f.label}</label>}
            {f.type === "lines" && <textarea id={`s-${f.key}`} rows={6} value={(val[f.key] ?? []).join("\n")} onChange={(e) => set({ [f.key]: e.target.value.split("\n") })} onBlur={() => set({ [f.key]: (val[f.key] ?? []).map((x: string) => x.trim()).filter(Boolean) })} />}
            {f.type === "paragraphs" && <textarea id={`s-${f.key}`} rows={12} value={(val[f.key] ?? []).join("\n\n")} onChange={(e) => set({ [f.key]: e.target.value.split(/\n{2,}/) })} onBlur={() => set({ [f.key]: (val[f.key] ?? []).map((x: string) => x.trim()).filter(Boolean) })} />}
            {f.type === "image" && <MediaField kind="image" value={val[f.key] ? { url: val[f.key], mimeType: "image/*" } : null} onChange={(m) => set({ [f.key]: m?.url ?? "" })} />}
            {f.type === "file" && <MediaField kind="resume" value={val[f.key] ? { url: val[f.key], filename: val[f.key] } : null} onChange={(m) => set({ [f.key]: m?.url ?? "" })} />}
            {f.help && <small>{f.help}</small>}
          </div>))}
        {sec.custom === "homepage" && <div><p style={{ marginTop: 0 }}>Choose which sections appear on the homepage.</p><label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><input type="checkbox" checked={val.showSkillLevels === true} onChange={(e) => set({ showSkillLevels: e.target.checked })} /> Show proficiency bars on skills (uses the level you set per skill; off = tags only)</label><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 8 }}>
          {HOME_KEYS.map((k) => <label key={k} style={{ display: "flex", gap: 8, alignItems: "center", textTransform: "capitalize" }}><input type="checkbox" checked={val.sections?.[k] !== false} onChange={(e) => set({ sections: { ...(val.sections ?? {}), [k]: e.target.checked } })} /> {k}</label>)}</div></div>}
        {sec.custom === "stats" && <div>
          {(val.items ?? []).map((s: any, i: number) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 70px auto", gap: 8, marginBottom: 8 }}>
              <input aria-label="Label" placeholder="Label" value={s.label} onChange={(e) => set({ items: val.items.map((x: any, j: number) => j === i ? { ...x, label: e.target.value } : x) })} />
              <input aria-label="Value" type="number" value={s.value} onChange={(e) => set({ items: val.items.map((x: any, j: number) => j === i ? { ...x, value: Number(e.target.value) } : x) })} />
              <input aria-label="Suffix" placeholder="+" value={s.suffix ?? ""} onChange={(e) => set({ items: val.items.map((x: any, j: number) => j === i ? { ...x, suffix: e.target.value } : x) })} />
              <button type="button" className="a-btn sm dng" aria-label="Remove" onClick={() => set({ items: val.items.filter((_: any, j: number) => j !== i) })}>✕</button>
            </div>))}
          <button type="button" className="a-btn sm" onClick={() => set({ items: [...(val.items ?? []), { label: "New stat", value: 0 }] })}>+ Add statistic</button>
          <p style={{ color: "#6B4A50", fontSize: 12.5 }}>Numbers shown here are exactly what you enter — nothing is computed or invented.</p></div>}
        <div><button className="a-btn pri" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</button></div>
      </div></div>
    </div>
  );
}
