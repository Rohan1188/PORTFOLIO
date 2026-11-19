
import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "../lib/site";

export function useScrollSpy() {
  const [active, setActive] = useState<string>(NAV_SECTIONS[0]);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function update() {
      const y = window.scrollY + window.innerHeight * 0.35;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(100, (window.scrollY / Math.max(1, docH)) * 100));
      setScrolled(window.scrollY > 30);

      let current: string = NAV_SECTIONS[0];
      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { active, progress, scrolled };
}
