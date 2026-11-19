import { FormEvent, useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Settings, Image as ImageIcon, Inbox, History, UserCog, LogOut, Menu, ExternalLink } from "lucide-react";
import "./admin.css";
import NepalFlag from "../components/NepalFlag";
import { admin, api, setCsrf } from "../lib/api";
import { ToastProvider, useToast } from "./ui";
import { RESOURCES } from "./resources";
import ResourcePage from "./ResourcePage";
import SettingsPage from "./SettingsPage";
import { Dashboard, Enquiries, MediaLibrary, Activity, Account } from "./Pages";

function AuthScreen({ needsSetup, onDone }: { needsSetup: boolean; onDone: (email: string) => void }) {
  const toast = useToast();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    try { const r = await api(`/api/admin/auth/${needsSetup ? "setup" : "login"}`, { method: "POST", body: { email, password } }); setCsrf(r.csrfToken); onDone(r.email); }
    catch (ex: any) { setErr(ex.fields?.password || ex.fields?.email || ex.message); toast(ex.message, "err"); }
    setBusy(false);
  };
  return (
    <div className="a-login">
      <motion.form className="a-card" onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 40 }}><NepalFlag /><h1 style={{ fontSize: 22 }}>{needsSetup ? "Create the admin account" : "Admin sign in"}</h1></div>
        {needsSetup && <p style={{ color: "#5b6478" }}>First-time setup. This works only once, while no admin exists.</p>}
        <div className="a-form" style={{ marginTop: 14 }}>
          <div className="a-field"><label htmlFor="em">Email</label><input id="em" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="a-field"><label htmlFor="pw">Password{needsSetup && " (12+ characters)"}</label><input id="pw" type="password" autoComplete={needsSetup ? "new-password" : "current-password"} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {err && <div className="a-err" role="alert">{err}</div>}
          <button className="a-btn pri" disabled={busy} style={{ justifyContent: "center" }}>{busy ? "Please wait…" : needsSetup ? "Create account" : "Sign in"}</button>
        </div>
      </motion.form>
    </div>
  );
}

function Shell({ email, onLogout }: { email: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false); const [unread, setUnread] = useState(0); const loc = useLocation();
  useEffect(() => { setOpen(false); admin("/enquiries?isRead=false&archived=false&isSpam=false&limit=1").then((r) => setUnread(r.total)).catch(() => {}); }, [loc.pathname]);
  const groups = RESOURCES.reduce((m: Record<string, typeof RESOURCES>, r) => ((m[r.group] ??= []).push(r), m), {});
  return (
    <div className="a-shell">
      {open && <div className="a-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside className={`a-side ${open ? "open" : ""}`} aria-label="Admin navigation">
        <div className="a-brand"><NepalFlag /> Portfolio Admin</div>
        <nav className="a-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "on" : "")}><LayoutDashboard size={16} /> Dashboard</NavLink>
          <NavLink to="/admin/enquiries" className={({ isActive }) => (isActive ? "on" : "")}><Inbox size={16} /> Enquiries {unread > 0 && <span className="a-badge">{unread}</span>}</NavLink>
          <small>Content</small>
          {groups.Content.map((r) => <NavLink key={r.path} to={`/admin/${r.path}`} className={({ isActive }) => (isActive ? "on" : "")}>{r.title}</NavLink>)}
          <small>Site</small>
          <NavLink to="/admin/media" className={({ isActive }) => (isActive ? "on" : "")}><ImageIcon size={16} /> Media library</NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? "on" : "")}><Settings size={16} /> Website settings</NavLink>
          <NavLink to="/admin/activity" className={({ isActive }) => (isActive ? "on" : "")}><History size={16} /> Activity log</NavLink>
          <NavLink to="/admin/account" className={({ isActive }) => (isActive ? "on" : "")}><UserCog size={16} /> My account</NavLink>
        </nav>
        <div style={{ marginTop: "auto", padding: 10, fontSize: 12, color: "#E3C9BF" }}>
          <div style={{ wordBreak: "break-all" }}>{email}</div>
          <a href="/" target="_blank" rel="noreferrer" style={{ color: "#F0DAD2", display: "inline-flex", gap: 4, alignItems: "center", margin: "6px 0" }}><ExternalLink size={12} /> View site</a><br />
          <button className="a-btn sm" onClick={onLogout}><LogOut size={13} /> Sign out</button>
        </div>
      </aside>
      <div>
        <div className="a-top"><button className="a-btn sm" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}><Menu size={16} /></button><b>Portfolio Admin</b></div>
        <main className="a-main" id="main-content">
          <motion.div key={loc.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="enquiries" element={<Enquiries />} />
              {RESOURCES.map((r) => <Route key={r.path} path={r.path} element={<ResourcePage def={r} />} />)}
              <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="activity" element={<Activity />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [state, setState] = useState<"loading" | "setup" | "login" | "in">("loading");
  const [email, setEmail] = useState(""); const nav = useNavigate();
  useEffect(() => {
    document.title = "Admin"; const meta = document.createElement("meta"); meta.name = "robots"; meta.content = "noindex,nofollow"; document.head.appendChild(meta);
    (async () => {
      try { const s = await api("/api/admin/auth/session"); setCsrf(s.csrfToken); setEmail(s.email); setState("in"); }
      catch { try { const st = await api("/api/admin/auth/status"); setState(st.needsSetup ? "setup" : "login"); } catch { setState("login"); } }
    })();
    return () => { meta.remove(); };
  }, []);
  const logout = async () => { try { await admin("/auth/logout", { method: "POST" }); } catch {} setCsrf(""); setState("login"); nav("/admin"); };
  return (
    <div className="adm">
      <ToastProvider>
        {state === "loading" && <p style={{ padding: 40 }}>Loading…</p>}
        {(state === "setup" || state === "login") && <AuthScreen needsSetup={state === "setup"} onDone={(e) => { setEmail(e); setState("in"); }} />}
        {state === "in" && <Shell email={email} onLogout={logout} />}
      </ToastProvider>
    </div>
  );
}
