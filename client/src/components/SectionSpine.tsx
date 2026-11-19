
import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "../lib/site";
import { useScrollSpy } from "./useScrollSpy";

export default function SectionSpine() {
  const { active, progress } = useScrollSpy();
  const [positions, setPositions] = useState<Record<string, number>>({});

  useEffect(() => {
    function measure() {
      const next: Record<string, number> = {};
      NAV_SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          next[id] = rect.top + window.scrollY + Math.min(120, rect.height / 2);
        }
      });
      setPositions(next);
    }
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 400); // re-measure after fonts/content settle
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      className="fixed top-0 bottom-0 left-[28px] w-[2px] z-40 hidden 2xl:block"
      style={{
        background:
          "linear-gradient(to bottom, transparent, var(--border) 8%, var(--border) 92%, transparent)",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full rounded-full transition-[height] duration-100 ease-linear"
        style={{ height: `${progress}%`, background: "linear-gradient(to bottom, var(--crimson), var(--blue))" }}
      />
      {NAV_SECTIONS.map((id) => {
        const isActive = active === id;
        const top = positions[id] ?? 0;
        return (
          <div key={id}>
            <div
              className="fixed w-[11px] h-[11px] rounded-full z-40 hidden 2xl:block transition-all duration-300"
              style={{
                left: 28,
                top,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.25 : 1})`,
                background: isActive ? "var(--crimson)" : "var(--bg)",
                border: `2px solid ${isActive ? "var(--crimson)" : "var(--text-faint)"}`,
                boxShadow: isActive ? "0 0 0 5px var(--crimson-soft)" : "none",
              }}
            />
            <div
              className="fixed font-mono text-[11px] z-40 hidden 2xl:block pointer-events-none transition-all duration-300 whitespace-nowrap"
              style={{
                left: 46,
                top,
                transform: `translate(${isActive ? 0 : -6}px, -50%)`,
                opacity: isActive ? 1 : 0,
                color: isActive ? "var(--text)" : "var(--text-faint)",
              }}
            >
              {id}
            </div>
          </div>
        );
      })}
    </div>
  );
}
