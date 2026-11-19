import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, FileText, Inbox, Wrench, MessageSquareQuote, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { admin, api, setCsrf } from "../lib/api";
import { Confirm, Modal, Pager, uploadFile, useToast } from "./ui";

// ---------------- Dashboard (every number comes from the database) ----------------
export function Dashboard() {
  const [d, setD] = useState<any>(null);
  const toast = useToast();
  useEffect(() => { admin("/dashboard").then(setD).catch((e) => toast(e.message, "err")); }, [toast]);
  if (!d) return <p>Loading…</p>;
  const t = d.totals;
  const stats = [["Projects", t.projects], ["Published", t.published], ["Drafts", t.drafts], ["Blog posts", t.posts], ["Published posts", t.publishedPosts], ["Enquiries", t.enquiries], ["Unread", t.unread], ["Skills", t.skills], ["Testimonials", t.testimonials]];
  const days: { date: string; count: number }[] = d.charts.enquiriesPerDay;
  const max = Math.max(1, ...days.map((x) => x.count)), maxC = Math.max(1, ...d.charts.projectsByCategory.map((c: any) => c.count));
  return (
    <div>
      <div className="a-head"><h1>Dashboard</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="a-btn" to="/admin/projects"><Plus size={14} /> Project</Link><Link className="a-btn" to="/admin/posts"><Plus size={14} /> Post</Link>
          <Link className="a-btn" to="/admin/enquiries"><Inbox size={14} /> Inbox</Link><Link className="a-btn" to="/admin/media">Upload media</Link></div></div>
      <div className="a-grid">{stats.map(([k, v], i) => <motion.div key={k as string} className="a-card a-stat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}><b>{v}</b><span>{k}</span></motion.div>)}</div>
      <div className="a-grid" style={{ marginTop: 14, gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
        <div className="a-card"><h2>Enquiries — last 30 days</h2>
          {days.length === 0 ? <p style={{ color: "#6B4A50" }}>No enquiries in this period.</p> : <div className="a-bars" role="img" aria-label="Enquiries per day">{days.map((x) => <motion.div key={x.date} title={`${x.date}: ${x.count}`} initial={{ height: 0 }} animate={{ height: `${(x.count / max) * 100}%` }} transition={{ duration: 0.7 }} />)}</div>}</div>
        <div className="a-card"><h2>Projects by category</h2>
          {d.charts.projectsByCategory.length === 0 ? <p style={{ color: "#6B4A50" }}>No projects yet.</p> : d.charts.projectsByCategory.map((c: any) => <div className="a-hbar" key={c.category}><span>{c.category}</span><motion.i initial={{ width: 0 }} animate={{ width: `${(c.count / maxC) * 100}%` }} transition={{ duration: 0.7 }} /><b>{c.count}</b></div>)}</div>
        <div className="a-card"><h2>Recent activity</h2>{d.recentActivity.length === 0 ? <p>No activity yet.</p> : <ul style={{ margin: 0, paddingLeft: 18 }}>{d.recentActivity.map((a: any) => <li key={a.id}><b>{a.action}</b> {a.detail && `— ${a.detail}`} <small style={{ color: "#6B4A50" }}>{new Date(a.createdAt).toLocaleString()}</small></li>)}</ul>}</div>
        <div className="a-card"><h2>Recent updates</h2>{d.recentUpdates.length === 0 ? <p>No projects yet.</p> : <ul style={{ margin: 0, paddingLeft: 18 }}>{d.recentUpdates.map((p: any) => <li key={p.id}>{p.name} <span className={`a-pill ${p.status}`}>{p.status}</span></li>)}</ul>}</div>
      </div>
    </div>
  );
}

// ---------------- Enquiries inbox ----------------
export function Enquiries() {
  const toast = useToast();
  const [data, setData] = useState<any>({ items: [], page: 1, pages: 1 }); const [q, setQ] = useState(""); const [view, setView] = useState("inbox"); const [page, setPage] = useState(1);
  const [open, setOpen] = useState<any | null>(null); const [del, setDel] = useState<any | null>(null);
  const load = useCallback(async () => {
    const f: Record<string, string> = view === "unread" ? { isRead: "false", archived: "false", isSpam: "false" } : view === "archived" ? { archived: "true" } : view === "spam" ? { isSpam: "true" } : { archived: "false", isSpam: "false" };
    try { setData(await admin(`/enquiries?${new URLSearchParams({ page: String(page), ...(q ? { q } : {}), ...f })}`)); } catch (e: any) { toast(e.message, "err"); }
  }, [q, view, page, toast]);
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);
  const patch = async (item: any, body: any) => { try { const r = await admin(`/enquiries/${item.id}`, { method: "PATCH", body }); setOpen((o: any) => (o && o.id === item.id ? r : o)); load(); } catch (e: any) { toast(e.message, "err"); } };
  const view1 = async (item: any) => { setOpen(item); if (!item.isRead) patch(item, { isRead: true }); };
  return (
    <div>
      <div className="a-head"><h1>Enquiries</h1></div>
      <div className="a-card">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {["inbox", "unread", "archived", "spam"].map((v) => <button key={v} className={`a-btn sm ${view === v ? "pri" : ""}`} onClick={() => { setView(v); setPage(1); }} style={{ textTransform: "capitalize" }}>{v}</button>)}
          <input style={{ flex: "1 1 200px" }} placeholder="Search name, email, message…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search enquiries" /></div>
        <div className="a-table-wrap"><table className="a-table"><thead><tr><th>From</th><th>Subject</th><th>Received</th><th>Status</th><th></th></tr></thead><tbody>
          {data.items.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 26, color: "#6B4A50" }}>No messages.</td></tr>}
          {data.items.map((e: any) => <tr key={e.id} style={{ fontWeight: e.isRead ? 400 : 700 }}><td>{e.name}<br /><small style={{ fontWeight: 400, color: "#6B4A50" }}>{e.email}</small></td><td>{e.subject}</td><td>{new Date(e.createdAt).toLocaleString()}</td><td><span className={`a-pill ${e.isRead ? "" : "new"}`}>{e.isRead ? e.status : "new"}</span></td>
            <td><div style={{ display: "flex", gap: 6 }}><button className="a-btn sm" onClick={() => view1(e)}>Read</button><button className="a-btn sm" onClick={() => patch(e, { isRead: !e.isRead })}>{e.isRead ? "Mark unread" : "Mark read"}</button><button className="a-btn sm" onClick={() => patch(e, { archived: !e.archived })}>{e.archived ? "Unarchive" : "Archive"}</button><button className="a-btn sm dng" onClick={() => setDel(e)} aria-label="Delete">✕</button></div></td></tr>)}
        </tbody></table></div>
        <Pager page={data.page} pages={data.pages} onPage={setPage} />
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.subject ?? ""} wide>
        {open && <div className="a-form">
          <p style={{ margin: 0 }}><b>{open.name}</b> &lt;<a href={`mailto:${open.email}`}>{open.email}</a>&gt; · {new Date(open.createdAt).toLocaleString()}{open.projectType && ` · ${open.projectType}`}</p>
          <div className="a-card" style={{ whiteSpace: "pre-wrap" }}>{open.message}</div>
          <div className="a-row"><div className="a-field"><label>Status</label><select value={open.status} onChange={(e) => patch(open, { status: e.target.value })}>{["new", "in_progress", "replied", "closed"].map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="a-field"><label>&nbsp;</label><label style={{ display: "flex", gap: 8, fontWeight: 400 }}><input type="checkbox" checked={open.isSpam} onChange={(e) => patch(open, { isSpam: e.target.checked })} /> Mark as spam</label></div></div>
          <div className="a-field"><label htmlFor="notes">Internal notes (never shown publicly)</label><textarea id="notes" rows={3} defaultValue={open.internalNotes ?? ""} onBlur={(e) => e.target.value !== (open.internalNotes ?? "") && patch(open, { internalNotes: e.target.value })} /></div>
          <div><a className="a-btn pri" href={`mailto:${open.email}?subject=${encodeURIComponent("Re: " + open.subject)}`}>Reply by email</a></div></div>}
      </Modal>
      <Confirm open={!!del} text="Delete this enquiry permanently?" onYes={async () => { try { await admin(`/enquiries/${del.id}`, { method: "DELETE" }); toast("Deleted.", "ok"); } catch (e: any) { toast(e.message, "err"); } setDel(null); load(); }} onNo={() => setDel(null)} />
    </div>
  );
}

// ---------------- Media library ----------------
export function MediaLibrary() {
  const toast = useToast();
  const [data, setData] = useState<any>({ items: [], page: 1, pages: 1 }); const [page, setPage] = useState(1); const [kind, setKind] = useState(""); const [busy, setBusy] = useState(false); const [del, setDel] = useState<any | null>(null);
  const load = useCallback(() => admin(`/media?page=${page}&limit=24${kind ? `&kind=${kind}` : ""}`).then(setData).catch((e) => toast(e.message, "err")), [page, kind, toast]);
  useEffect(() => { load(); }, [load]);
  const up = async (files: FileList | null, k: string) => { if (!files) return; setBusy(true); for (const f of Array.from(files)) { try { await uploadFile(f, k); } catch (e: any) { toast(`${f.name}: ${e.message}`, "err"); } } setBusy(false); toast("Upload finished.", "ok"); load(); };
  const replace = async (m: any, f?: File) => { if (!f) return; try { await admin(`/media/${m.id}/replace`, { method: "PUT", raw: true, body: await f.arrayBuffer(), headers: { "Content-Type": "application/octet-stream" } }); toast("File replaced everywhere it is used.", "ok"); load(); } catch (e: any) { toast(e.message, "err"); } };
  const alt = async (m: any, altText: string) => { try { await admin(`/media/${m.id}`, { method: "PATCH", body: { altText } }); } catch (e: any) { toast(e.message, "err"); } };
  return (
    <div>
      <div className="a-head"><h1>Media library</h1><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select style={{ width: 140 }} value={kind} onChange={(e) => { setKind(e.target.value); setPage(1); }} aria-label="Filter by type"><option value="">All types</option><option value="image">Images</option><option value="resume">Resumes</option><option value="certificate">Certificates</option></select>
        <label className="a-btn pri">{busy ? "Uploading…" : "Upload images"}<input hidden multiple type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => up(e.target.files, "image")} /></label>
        <label className="a-btn">Upload PDF<input hidden type="file" accept="application/pdf" onChange={(e) => up(e.target.files, "resume")} /></label></div></div>
      <p style={{ color: "#6B4A50" }}>PNG, JPEG, WebP, GIF or PDF up to 8 MB. File type is verified from the file contents.</p>
      <div className="a-media">{data.items.map((m: any) => (
        <figure key={m.id}>{m.mimeType.startsWith("image/") ? <img src={m.url} alt={m.altText || ""} loading="lazy" /> : <div style={{ aspectRatio: "1", display: "grid", placeItems: "center" }}>PDF</div>}
          <figcaption><div>{m.filename}</div><small>{(m.sizeBytes / 1024).toFixed(0)} KB</small>
            <input aria-label="Alt text" placeholder="Alt text" defaultValue={m.altText ?? ""} onBlur={(e) => e.target.value !== (m.altText ?? "") && alt(m, e.target.value)} style={{ marginTop: 6, padding: 5, fontSize: 12 }} />
            <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}><button className="a-btn sm" onClick={() => navigator.clipboard?.writeText(location.origin + m.url).then(() => toast("URL copied.", "ok"))}>Copy URL</button>
              <label className="a-btn sm">Replace<input hidden type="file" onChange={(e) => replace(m, e.target.files?.[0])} /></label><button className="a-btn sm dng" onClick={() => setDel(m)}>Delete</button></div></figcaption></figure>))}</div>
      {data.items.length === 0 && <p>No files yet.</p>}
      <Pager page={data.page} pages={data.pages} onPage={setPage} />
      <Confirm open={!!del} text={`Delete ${del?.filename}?`} onYes={async () => { try { await admin(`/media/${del.id}`, { method: "DELETE" }); toast("Deleted.", "ok"); } catch (e: any) { toast(e.message, "err"); } setDel(null); load(); }} onNo={() => setDel(null)} />
    </div>
  );
}

// ---------------- Activity log ----------------
export function Activity() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { admin("/activity?limit=100").then(setRows).catch(() => {}); }, []);
  return <div><div className="a-head"><h1>Activity log</h1></div><div className="a-card a-table-wrap"><table className="a-table"><thead><tr><th>When</th><th>Action</th><th>Item</th></tr></thead><tbody>
    {rows.length === 0 && <tr><td colSpan={3}>No activity yet.</td></tr>}{rows.map((r) => <tr key={r.id}><td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.action}</td><td>{r.detail ?? r.entityId ?? ""}</td></tr>)}</tbody></table></div></div>;
}

// ---------------- Account: password + sessions ----------------
export function Account() {
  const toast = useToast();
  const [cur, setCur] = useState(""); const [nw, setNw] = useState(""); const [sessions, setSessions] = useState<any[]>([]);
  const load = useCallback(() => admin("/auth/sessions").then(setSessions).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);
  const change = async () => { try { await admin("/auth/change-password", { method: "POST", body: { currentPassword: cur, newPassword: nw } }); toast("Password changed. Other devices were signed out.", "ok"); setCur(""); setNw(""); load(); } catch (e: any) { toast(e.fields?.[""] || e.message, "err"); } };
  return (
    <div><div className="a-head"><h1>My account</h1></div>
      <div className="a-card" style={{ maxWidth: 460, marginBottom: 14 }}><h2>Change password</h2><div className="a-form">
        <div className="a-field"><label htmlFor="cp">Current password</label><input id="cp" type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></div>
        <div className="a-field"><label htmlFor="np">New password (12+ characters)</label><input id="np" type="password" autoComplete="new-password" value={nw} onChange={(e) => setNw(e.target.value)} /></div>
        <div><button className="a-btn pri" onClick={change}>Update password</button></div></div></div>
      <div className="a-card"><h2>Active sessions</h2><div className="a-table-wrap"><table className="a-table"><thead><tr><th>Device</th><th>Last active</th><th></th></tr></thead><tbody>
        {sessions.map((s) => <tr key={s.id}><td>{s.userAgent || "Unknown"} {s.current && <span className="a-pill on">this device</span>}</td><td>{new Date(s.lastSeenAt).toLocaleString()}</td><td>{!s.current && <button className="a-btn sm dng" onClick={async () => { await admin(`/auth/sessions/${s.id}`, { method: "DELETE" }); load(); }}>Sign out</button>}</td></tr>)}</tbody></table></div></div></div>
  );
}
