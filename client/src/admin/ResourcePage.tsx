import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { admin, ApiError } from "../lib/api";
import { Confirm, MediaField, Modal, Pager, RichText, useToast } from "./ui";
import type { FieldDef, ResourceDef } from "./resources";

const idOf = (v: any) => (v && typeof v === "object" ? v.id : v ?? null);
const toLocalInput = (d?: string) => (d ? new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 6e4).toISOString().slice(0, 16) : "");

function defaults(def: ResourceDef) {
  const v: Record<string, any> = {};
  for (const f of def.fields) v[f.key] = f.default ?? (f.type === "bool" ? false : f.type === "tags" || f.type === "lines" ? [] : f.type === "media" || f.type === "relation" ? null : f.type === "number" ? undefined : "");
  return v;
}
function fromItem(def: ResourceDef, item: any) {
  const v = defaults(def);
  for (const f of def.fields) if (item[f.key] !== undefined && item[f.key] !== null) v[f.key] = f.type === "datetime" ? toLocalInput(item[f.key]) : item[f.key];
  return v;
}
function toPayload(def: ResourceDef, v: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const f of def.fields) {
    let x = v[f.key];
    if (f.type === "media" || f.type === "relation") x = idOf(x);
    else if (f.type === "datetime") x = x ? new Date(x).toISOString() : null;
    else if (f.type === "number") { if (x === "" || x === undefined || x === null) continue; x = Number(x); }
    out[f.key] = x;
  }
  return out;
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [t, setT] = useState("");
  const add = () => { const s = t.trim().replace(/,$/, ""); if (s && !value.includes(s)) onChange([...value, s]); setT(""); };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>{value.map((x) => <span key={x} className="a-pill">{x} <button type="button" aria-label={`Remove ${x}`} onClick={() => onChange(value.filter((y) => y !== x))} style={{ all: "unset", cursor: "pointer" }}>×</button></span>)}</div>
      <input value={t} onChange={(e) => setT(e.target.value)} onBlur={add} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} placeholder="Type and press Enter" />
    </div>
  );
}

function RelationSelect({ f, value, onChange }: { f: FieldDef; value: any; onChange: (v: any) => void }) {
  const [opts, setOpts] = useState<any[]>([]);
  useEffect(() => { admin(`/${f.relation!.path}?limit=100`).then((r) => setOpts(r.items)).catch(() => {}); }, [f.relation]);
  return (
    <select value={idOf(value) ?? ""} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">— none —</option>{opts.map((o) => <option key={o.id} value={o.id}>{o[f.relation!.label]}</option>)}
    </select>
  );
}

function FieldInput({ f, v, set, err }: { f: FieldDef; v: any; set: (x: any) => void; err?: string }) {
  const id = `f-${f.key}`;
  let input;
  switch (f.type) {
    case "textarea": input = <textarea id={id} rows={4} value={v ?? ""} onChange={(e) => set(e.target.value)} />; break;
    case "number": input = <input id={id} type="number" value={v ?? ""} onChange={(e) => set(e.target.value)} />; break;
    case "bool": input = <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 400 }}><input id={id} type="checkbox" checked={!!v} onChange={(e) => set(e.target.checked)} /> {f.label}</label>; break;
    case "select": input = <select id={id} value={v ?? ""} onChange={(e) => set(e.target.value)}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>; break;
    case "tags": input = <TagsInput value={v ?? []} onChange={set} />; break;
    case "lines": input = <textarea id={id} rows={5} value={(v ?? []).join("\n")} onChange={(e) => set(e.target.value.split("\n"))} onBlur={() => set((v ?? []).map((s: string) => s.trim()).filter(Boolean))} />; break;
    case "datetime": input = <input id={id} type="datetime-local" value={v ?? ""} onChange={(e) => set(e.target.value)} />; break;
    case "richtext": input = <RichText value={v ?? ""} onChange={set} />; break;
    case "media": input = <MediaField value={v} onChange={set} kind={f.mediaKind} />; break;
    case "relation": input = <RelationSelect f={f} value={v} onChange={set} />; break;
    default: input = <input id={id} type="text" value={v ?? ""} onChange={(e) => set(e.target.value)} />;
  }
  return (
    <div className="a-field" style={f.half ? undefined : { gridColumn: "1 / -1" }}>
      {f.type !== "bool" && <label htmlFor={id}>{f.label}{f.required && " *"}</label>}
      {input}{f.help && <small>{f.help}</small>}{err && <div className="a-err" role="alert">{err}</div>}
    </div>
  );
}

const cell = (c: ResourceDef["columns"][number], item: any) => {
  const v = item[c.key];
  if (c.kind === "bool") return <span className={`a-pill ${v ? "on" : "off"}`}>{v ? "Yes" : "No"}</span>;
  if (c.kind === "pill") return <span className={`a-pill ${v}`}>{v}</span>;
  if (c.kind === "media") return v?.url ? <img src={v.url} alt="" width={44} height={44} style={{ objectFit: "cover", borderRadius: 6 }} /> : "—";
  if (c.kind === "relation") return v?.name ?? v?.title ?? "—";
  if (/At$/.test(c.key) && v) return new Date(v).toLocaleString();
  return v ?? "—";
};

export default function ResourcePage({ def }: { def: ResourceDef }) {
  const toast = useToast();
  const [data, setData] = useState<{ items: any[]; total: number; page: number; pages: number }>({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState(""); const [filters, setFilters] = useState<Record<string, string>>({}); const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [edit, setEdit] = useState<{ item: any | null } | null>(null);
  const [del, setDel] = useState<any | null>(null); const [bulkDel, setBulkDel] = useState(false);
  const [preview, setPreview] = useState<any | null>(null);
  const [dragId, setDragId] = useState<string | null>(null); const [overId, setOverId] = useState<string | null>(null);
  const sortableNow = def.sortable && !q && !Object.values(filters).some(Boolean);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), limit: sortableNow ? "100" : "20", ...(q ? { q } : {}), ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) });
    try { setData(await admin(`/${def.path}?${qs}`)); setSel(new Set()); } catch (e: any) { toast(e.message, "err"); }
    setLoading(false);
  }, [def.path, page, q, filters, sortableNow, toast]);
  useEffect(() => { setPage(1); setQ(""); setFilters({}); }, [def.path]);
  useEffect(() => { const t = setTimeout(load, q ? 250 : 0); return () => clearTimeout(t); }, [load, q]);

  const remove = async (item: any) => { try { await admin(`/${def.path}/${item.id}`, { method: "DELETE" }); toast("Deleted.", "ok"); setDel(null); load(); } catch (e: any) { toast(e.message, "err"); setDel(null); } };
  const quick = async (item: any) => { const k = def.quick!.key; try { await admin(`/${def.path}/${item.id}`, { method: "PATCH", body: { [k]: !item[k] } }); load(); } catch (e: any) { toast(e.message, "err"); } };
  const bulk = async (action: string) => {
    if (action === "delete") return setBulkDel(true);
    try { const r = await admin(`/${def.path}/bulk`, { method: "POST", body: { action, ids: [...sel] } }); toast(`${r.affected} updated.`, "ok"); load(); } catch (e: any) { toast(e.message, "err"); }
  };
  const doBulkDelete = async () => { setBulkDel(false); try { const r = await admin(`/${def.path}/bulk`, { method: "POST", body: { action: "delete", ids: [...sel] } }); toast(`${r.affected} deleted.`, "ok"); load(); } catch (e: any) { toast(e.message, "err"); } };

  const drop = async (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const ids = data.items.map((i) => i.id), from = ids.indexOf(dragId), to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setData({ ...data, items: ids.map((i) => data.items.find((x) => x.id === i)) });
    try { await admin(`/${def.path}/reorder`, { method: "POST", body: { ids } }); toast("Order saved.", "ok"); } catch (e: any) { toast(e.message, "err"); load(); }
    setDragId(null); setOverId(null);
  };

  const allOn = data.items.length > 0 && sel.size === data.items.length;
  return (
    <div>
      <div className="a-head"><h1>{def.title}</h1><button className="a-btn pri" onClick={() => setEdit({ item: null })}><Plus size={16} /> Add {def.singular}</button></div>
      <div className="a-card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}><Search size={15} style={{ position: "absolute", left: 10, top: 11, color: "#8a6a5e" }} /><input style={{ paddingLeft: 32 }} placeholder="Search…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search" /></div>
          {def.filters?.map((f) => <select key={f.key} style={{ width: 160 }} value={filters[f.key] ?? ""} onChange={(e) => { setFilters({ ...filters, [f.key]: e.target.value }); setPage(1); }} aria-label={f.label}><option value="">All {f.label.toLowerCase()}</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>)}
          {sel.size > 0 && def.bulk && <select style={{ width: 190 }} value="" onChange={(e) => e.target.value && bulk(e.target.value)} aria-label="Bulk action"><option value="">{sel.size} selected — action…</option>{def.bulk.map((b) => <option key={b} value={b}>{b[0].toUpperCase() + b.slice(1)}</option>)}</select>}
        </div>
        {def.sortable && <p style={{ margin: "0 0 10px", color: "#6B4A50", fontSize: 12.5 }}>{sortableNow ? "Drag rows to reorder — the new order is saved instantly and used on the public site." : "Clear search and filters to enable drag-and-drop ordering."}</p>}
        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr>{def.bulk && <th style={{ width: 30 }}><input type="checkbox" aria-label="Select all" checked={allOn} onChange={() => setSel(allOn ? new Set() : new Set(data.items.map((i) => i.id)))} /></th>}{def.columns.map((c) => <th key={c.key}>{c.label}</th>)}<th style={{ width: 230 }}>Actions</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={9}>Loading…</td></tr>}
              {!loading && data.items.length === 0 && <tr><td colSpan={9} style={{ textAlign: "center", padding: 28, color: "#6B4A50" }}>Nothing here yet. Use “Add {def.singular}”.</td></tr>}
              {!loading && data.items.map((item, i) => (
                <motion.tr key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.02 }}
                  draggable={!!sortableNow} onDragStart={() => setDragId(item.id)} onDragOver={(e) => { if (sortableNow) { e.preventDefault(); setOverId(item.id); } }} onDrop={() => drop(item.id)} onDragEnd={() => { setDragId(null); setOverId(null); }} className={overId === item.id ? "drag-over" : ""}>
                  {def.bulk && <td><input type="checkbox" aria-label="Select row" checked={sel.has(item.id)} onChange={() => { const n = new Set(sel); n.has(item.id) ? n.delete(item.id) : n.add(item.id); setSel(n); }} /></td>}
                  {def.columns.map((c) => <td key={c.key}>{cell(c, item)}</td>)}
                  <td><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button className="a-btn sm" onClick={() => setEdit({ item })}><Pencil size={13} /> Edit</button>
                    {def.quick && <button className="a-btn sm" onClick={() => quick(item)}>{item[def.quick.key] ? def.quick.on : def.quick.off}</button>}
                    <button className="a-btn sm dng" onClick={() => setDel(item)} aria-label={`Delete ${item.name ?? item.title ?? ""}`}><Trash2 size={13} /></button>
                  </div></td>
                </motion.tr>))}
            </tbody>
          </table>
        </div>
        <Pager page={data.page} pages={data.pages} onPage={setPage} />
      </div>
      {edit && <EditModal def={def} item={edit.item} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); }} onPreview={setPreview} />}
      <Confirm open={!!del} text={`Delete “${del?.name ?? del?.title ?? del?.company ?? del?.degree ?? "this item"}”? This cannot be undone.`} onYes={() => remove(del)} onNo={() => setDel(null)} />
      <Confirm open={bulkDel} text={`Delete ${sel.size} selected item(s)? This cannot be undone.`} onYes={doBulkDelete} onNo={() => setBulkDel(false)} />
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Preview" wide>
        {preview && <article className="prose-post"><h1 style={{ fontSize: 28 }}>{preview.title ?? preview.name}</h1><p><em>{preview.excerpt ?? preview.summary}</em></p>{preview.body ? <div dangerouslySetInnerHTML={{ __html: preview.body }} /> : <p>{preview.description}</p>}<p><span className={`a-pill ${preview.status}`}>{preview.status}</span></p></article>}
      </Modal>
    </div>
  );
}

function EditModal({ def, item, onClose, onSaved, onPreview }: { def: ResourceDef; item: any | null; onClose: () => void; onSaved: () => void; onPreview: (p: any) => void }) {
  const toast = useToast();
  const draftKey = `admin-draft:${def.path}`;
  const [v, setV] = useState<Record<string, any>>(() => {
    if (item) return fromItem(def, item);
    try { const d = localStorage.getItem(draftKey); if (d) return { ...defaults(def), ...JSON.parse(d) }; } catch {}
    return defaults(def);
  });
  const [errs, setErrs] = useState<Record<string, string>>({}); const [saving, setSaving] = useState(false);
  const restored = useMemo(() => !item && !!localStorage.getItem(draftKey), []); // eslint-disable-line
  // Auto-save drafts of NEW items (so a closed tab doesn't lose a long article).
  useEffect(() => { if (item) return; const t = setTimeout(() => { try { localStorage.setItem(draftKey, JSON.stringify(v)); } catch {} }, 600); return () => clearTimeout(t); }, [v, item, draftKey]);

  const save = async () => {
    setSaving(true); setErrs({});
    try {
      const payload = toPayload(def, v);
      await admin(item ? `/${def.path}/${item.id}` : `/${def.path}`, { method: item ? "PATCH" : "POST", body: payload });
      try { if (!item) localStorage.removeItem(draftKey); } catch {}
      toast(item ? "Changes saved." : "Created.", "ok"); onSaved();
    } catch (e: any) { if (e instanceof ApiError && e.fields) setErrs(e.fields); toast(e.message, "err"); }
    setSaving(false);
  };
  return (
    <Modal open onClose={onClose} title={`${item ? "Edit" : "Add"} ${def.singular}`} wide>
      {restored && <p className="a-pill draft" style={{ marginTop: 0 }}>Restored your unsaved draft. <button type="button" style={{ all: "unset", cursor: "pointer", textDecoration: "underline" }} onClick={() => { try { localStorage.removeItem(draftKey); } catch {} setV(defaults(def)); }}>Discard</button></p>}
      <div className="a-form"><div className="a-row">{def.fields.map((f) => <FieldInput key={f.key} f={f} v={v[f.key]} set={(x) => setV((s) => ({ ...s, [f.key]: x }))} err={errs[f.key]} />)}</div></div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16, flexWrap: "wrap" }}>
        {def.preview && <button className="a-btn" onClick={() => onPreview({ ...v })}><Eye size={14} /> Preview</button>}
        <button className="a-btn" onClick={onClose}>Cancel</button>
        <button className="a-btn pri" disabled={saving} onClick={save}>{saving ? "Saving…" : item ? "Save changes" : "Create"}</button>
      </div>
    </Modal>
  );
}
