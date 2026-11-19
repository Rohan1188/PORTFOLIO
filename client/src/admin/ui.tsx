import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bold, Italic, List, ListOrdered, Link2, Heading2, Quote, ImageIcon, Underline } from "lucide-react";
import { admin } from "../lib/api";

// ---------- Toasts ----------
type Toast = { id: number; kind: "ok" | "err" | ""; text: string };
const ToastCtx = createContext<(text: string, kind?: "ok" | "err") => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: "ok" | "err" | "" = "ok") => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, kind, text }]); setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 4200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="a-toasts" role="status" aria-live="polite">
        <AnimatePresence>{list.map((t) => <motion.div key={t.id} className={`a-toast ${t.kind}`} initial={{ opacity: 0, y: 14, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30 }}>{t.text}</motion.div>)}</AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

// ---------- Modal + confirm ----------
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="a-modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="a-modal" role="dialog" aria-modal="true" aria-label={title} style={wide ? { width: "min(1000px,100%)" } : undefined} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}>
            <div className="a-head" style={{ marginBottom: 12 }}><h2 style={{ margin: 0 }}>{title}</h2><button className="a-btn sm" onClick={onClose} aria-label="Close">✕</button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Confirm({ open, text, onYes, onNo, danger = true }: { open: boolean; text: string; onYes: () => void; onNo: () => void; danger?: boolean }) {
  return (
    <Modal open={open} onClose={onNo} title="Please confirm">
      <p style={{ marginTop: 0 }}>{text}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="a-btn" onClick={onNo}>Cancel</button>
        <button className={`a-btn ${danger ? "dng" : "pri"}`} onClick={onYes}>{danger ? "Yes, delete" : "Confirm"}</button>
      </div>
    </Modal>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", marginTop: 12 }}>
    <button className="a-btn sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>← Prev</button><span>Page {page} / {pages}</span>
    <button className="a-btn sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next →</button></div>;
}

// ---------- Media upload + picker ----------
export async function uploadFile(file: File, kind: string, alt = "") {
  const buf = await file.arrayBuffer();
  return admin(`/media?kind=${kind}&alt=${encodeURIComponent(alt)}`, { method: "POST", raw: true, body: buf, headers: { "x-filename": encodeURIComponent(file.name), "Content-Type": "application/octet-stream" } });
}

export function MediaField({ value, onChange, kind = "image" }: { value?: any; onChange: (m: any | null) => void; kind?: string }) {
  const toast = useToast(); const [busy, setBusy] = useState(false); const [pick, setPick] = useState(false);
  const media = value && typeof value === "object" ? value : null;
  const onFile = async (f?: File) => { if (!f) return; setBusy(true); try { onChange(await uploadFile(f, kind)); toast("Uploaded.", "ok"); } catch (e: any) { toast(e.message, "err"); } setBusy(false); };
  return (
    <div>
      {media?.url && (media.mimeType?.startsWith("image/") ? <img src={media.url} alt="" style={{ maxHeight: 110, borderRadius: 8, display: "block", marginBottom: 8 }} /> : <a href={media.url} target="_blank" rel="noreferrer">{media.filename}</a>)}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label className="a-btn sm">{busy ? "Uploading…" : "Upload"}<input type="file" hidden accept={kind === "image" ? "image/png,image/jpeg,image/webp,image/gif" : "application/pdf,image/png,image/jpeg"} onChange={(e) => onFile(e.target.files?.[0])} /></label>
        <button type="button" className="a-btn sm" onClick={() => setPick(true)}>Choose from library</button>
        {media && <button type="button" className="a-btn sm dng" onClick={() => onChange(null)}>Remove</button>}
      </div>
      <MediaPicker open={pick} kind={kind} onClose={() => setPick(false)} onPick={(m) => { onChange(m); setPick(false); }} />
    </div>
  );
}

export function MediaPicker({ open, onClose, onPick, kind }: { open: boolean; onClose: () => void; onPick: (m: any) => void; kind?: string }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { if (open) admin(`/media?limit=60${kind ? `&kind=${kind}` : ""}`).then((r) => setItems(r.items)).catch(() => {}); }, [open, kind]);
  return (
    <Modal open={open} onClose={onClose} title="Media library" wide>
      {items.length === 0 ? <p>No files yet — upload one first.</p> : <div className="a-media">{items.map((m) => (
        <figure key={m.id}><button type="button" onClick={() => onPick(m)} style={{ all: "unset", cursor: "pointer", display: "block" }}>{m.mimeType.startsWith("image/") ? <img src={m.url} alt={m.altText || ""} loading="lazy" /> : <div style={{ padding: 30, textAlign: "center" }}>PDF</div>}<figcaption>{m.filename}</figcaption></button></figure>))}</div>}
    </Modal>
  );
}

// ---------- Rich text (contentEditable; output is sanitised again on the server) ----------
export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ""; }, [value]);
  const cmd = (c: string, arg?: string) => { ref.current?.focus(); document.execCommand(c, false, arg); onChange(ref.current!.innerHTML); };
  const B = ({ c, arg, I, t }: any) => <button type="button" className="a-btn sm" title={t} aria-label={t} onMouseDown={(e) => e.preventDefault()} onClick={() => cmd(c, arg)}><I size={14} /></button>;
  return (
    <div>
      <div className="a-rt-bar">
        <B c="bold" I={Bold} t="Bold" /><B c="italic" I={Italic} t="Italic" /><B c="underline" I={Underline} t="Underline" />
        <B c="formatBlock" arg="h2" I={Heading2} t="Heading" /><B c="formatBlock" arg="blockquote" I={Quote} t="Quote" />
        <B c="insertUnorderedList" I={List} t="Bullet list" /><B c="insertOrderedList" I={ListOrdered} t="Numbered list" />
        <button type="button" className="a-btn sm" title="Link" aria-label="Link" onMouseDown={(e) => e.preventDefault()} onClick={() => { const u = prompt("Link URL (https://…)"); if (u) cmd("createLink", u); }}><Link2 size={14} /></button>
        <button type="button" className="a-btn sm" title="Image" aria-label="Insert image" onMouseDown={(e) => e.preventDefault()} onClick={() => { const u = prompt("Image URL (upload in Media first, then paste its /media/… URL)"); if (u) cmd("insertImage", u); }}><ImageIcon size={14} /></button>
      </div>
      <div ref={ref} className="a-rt prose-post" contentEditable suppressContentEditableWarning onInput={() => onChange(ref.current!.innerHTML)} />
    </div>
  );
}
