import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiteProvider, useSite } from "./lib/site";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import Home from "./pages/Home";
import { BlogList, BlogPost } from "./pages/BlogPages";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";

const AdminApp = lazy(() => import("./admin/AdminApp")); // admin code is split out of the public bundle

function PublicRoutes() {
  const loc = useLocation();
  const SITE = useSite();
  const reduce = useReducedMotion();
  const noMotion = reduce || SITE.animation.enabled === false;

  // Jump to #section after navigating to "/#section"
  useEffect(() => {
    if (!SITE.loaded) return;
    if (loc.hash) setTimeout(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView({ behavior: noMotion ? "auto" : "smooth" }), 60);
    else window.scrollTo(0, 0);
  }, [loc.pathname, loc.hash, SITE.loaded, noMotion]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={loc.pathname} initial={noMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={noMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.35 }}>
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

/** Buttons gently follow the cursor (fine pointers only, never with reduced motion). */
function useMagnetic(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let el: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(".btn") as HTMLElement | null;
      if (el && el !== t) { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); }
      el = t; if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${((e.clientX - r.left) / r.width - 0.5) * 10}px`);
      t.style.setProperty("--my", `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
    };
    const leave = () => { if (el) { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); el = null; } };
    document.addEventListener("pointermove", move); document.addEventListener("pointerleave", leave, true);
    return () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave, true); };
  }, [enabled]);
}

function PublicShell() {
  const SITE = useSite();
  const [minElapsed, setMin] = useState(false);
  const reduceMotion = useReducedMotion();
  useMagnetic(!reduceMotion && SITE.animation.enabled !== false);
  useEffect(() => { const t = setTimeout(() => setMin(true), 700); return () => clearTimeout(t); }, []);
  const showLoader = (!SITE.loaded || !minElapsed) && SITE.animation.loader !== false;
  return (
    <>
      <Loader show={showLoader} />
      {SITE.animation.customCursor !== false && <CustomCursor />}
      {SITE.loaded && <PublicRoutes />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={<div style={{ padding: 40 }}>Loading admin…</div>}><AdminApp /></Suspense>} />
        <Route path="/*" element={<SiteProvider><PublicShell /></SiteProvider>} />
      </Routes>
    </BrowserRouter>
  );
}
