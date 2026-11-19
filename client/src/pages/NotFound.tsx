import { Link } from "react-router-dom";
import { useSeo } from "../lib/site";
export default function NotFound() {
  useSeo("Page not found");
  return (
    <main id="main-content" style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
      <div><p className="font-mono text-xs mb-3" style={{ color: "var(--blue)" }}>404</p><h1 className="font-display text-3xl font-semibold mb-4">This page doesn’t exist.</h1><Link to="/" className="btn btn-primary">Back home</Link></div>
    </main>
  );
}
