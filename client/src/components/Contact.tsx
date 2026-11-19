
import { FormEvent, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSite } from "../lib/site";
import NepalFlag from "./NepalFlag";
import Mandala from "./Mandala";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const SITE = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please try again in a moment.");
    }
  }

  return (
    <section id="contact" className="py-28 md:py-36 relative overflow-hidden">
      <Mandala className="left-[-140px] bottom-0 w-[420px] hidden lg:block" />
      <div className="container-x">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14">
          <RevealOnScroll>
            <>
              <SectionHeading compact label="Get in touch" title="Let's build something." />
              <p className="mb-10" style={{ color: "var(--text-muted)" }}>
                Have a project, a role, or just a question? My inbox is open — I usually reply within a
                day.
              </p>
              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-3">
                  <Mail size={17} color="var(--crimson)" />
                  <a href={`mailto:${SITE.email}`} className="text-sm" data-cursor>
                    {SITE.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={17} color="var(--crimson)" />
                  <span className="text-sm">{SITE.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={17} color="var(--crimson)" />
                  <span className="text-sm">{SITE.location}</span>
                </div>
              </div>
              <div className="card p-4 flex items-center gap-3">
                <NepalFlag className="flag-np" />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Working NPT (UTC+5:45) — usually online 10:00–19:00.
                </p>
              </div>
            </>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <form onSubmit={handleSubmit} className="card p-8 md:p-10 space-y-5">
              {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label>
                  Leave this field empty
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="font-mono text-xs block mb-2" style={{ color: "var(--text-faint)" }}>
                    Name
                  </label>
                  <input required type="text" id="contact-name" name="name" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="font-mono text-xs block mb-2" style={{ color: "var(--text-faint)" }}>
                    Email
                  </label>
                  <input required type="email" id="contact-email" name="email" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="font-mono text-xs block mb-2" style={{ color: "var(--text-faint)" }}>
                  Subject
                </label>
                <input required type="text" id="contact-subject" name="subject" placeholder="What's this about?" />
              </div>
              <div>
                <label htmlFor="contact-message" className="font-mono text-xs block mb-2" style={{ color: "var(--text-faint)" }}>
                  Message
                </label>
                <textarea required id="contact-message" name="message" rows={5} placeholder="Tell me a bit about the project…" />
              </div>
              <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto" data-cursor>
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
              {status === "success" && (
                <p className="text-sm font-mono" style={{ color: "#3DD68C" }}>
                  ✓ Message sent — I&apos;ll get back to you within a day.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm font-mono" style={{ color: "var(--crimson)" }}>
                  {errorMsg}
                </p>
              )}
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
