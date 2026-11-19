
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

// The theme lives on <html data-theme>, set before first paint by ThemeScript. Treat it as an external store:
// React re-reads it whenever the attribute changes, and the server render assumes dark.
const subscribe = (notify: () => void) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const getTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
const getServerTheme = (): Theme => "dark";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next); // the subscription re-renders us
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable — theme still applies for this session
    }
  }

  return (
    <button
      onClick={toggle}
      data-cursor
      aria-label="Toggle light and dark mode"
      className="w-9 h-9 rounded-full border flex items-center justify-center"
      style={{ borderColor: "var(--border)" }}
    >
      {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
