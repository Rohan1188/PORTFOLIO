
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cx = 0,
      cy = 0,
      rx = 0,
      ry = 0,
      raf = 0;

    function onMove(e: MouseEvent) {
      cx = e.clientX;
      cy = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = cx + "px";
        dotRef.current.style.top = cy + "px";
      }
    }

    function tick() {
      rx += (cx - rx) * 0.18;
      ry += (cy - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top = ry + "px";
      }
      raf = requestAnimationFrame(tick);
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor], a, button")) {
        ringRef.current?.classList.add("expand");
      }
    }
    function onOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor], a, button")) {
        ringRef.current?.classList.remove("expand");
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
