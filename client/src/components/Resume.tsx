import { Download } from "lucide-react";
import { useSite } from "../lib/site";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeading from "./SectionHeading";

export default function Resume() {
  const SITE = useSite();
  return (
    <section id="resume" className="py-28 md:py-36">
      <div className="container-x">
        <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-14">
          <RevealOnScroll>
            <>
              <SectionHeading compact label="Resume" title="The short version." />
              <p className="mb-8" style={{ color: "var(--text-muted)" }}>
                A full breakdown of my experience, skills, and education in one document — updated
                quarterly.
              </p>
              <a href={SITE.cvUrl} download className="btn btn-primary" data-cursor>
                <Download size={15} />
                Download CV
              </a>
            </>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="card p-8 md:p-10">
            <>
              <p className="font-display text-xl mb-3 font-semibold">Professional summary</p>
              <p className="mb-8" style={{ color: "var(--text-muted)" }}>
                Computer Science undergraduate (B.Tech, KIIT) currently serving as IT Head at Nepal Living
                Connecting IT Solution and Manager at OS Group of Company. Comfortable moving between MERN
                builds, WordPress migrations, and Python/ML projects across a live portfolio of client work.
              </p>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="font-mono text-xs mb-3" style={{ color: "var(--text-faint)" }}>
                    core skills
                  </p>
                  <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                    <li>Java, Python, C, C# .NET</li>
                    <li>React, Node.js, Express.js (MERN)</li>
                    <li>WordPress, MySQL, MongoDB</li>
                    <li>AWS, Linux, Git &amp; GitHub</li>
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-xs mb-3" style={{ color: "var(--text-faint)" }}>
                    certifications
                  </p>
                  <ul className="space-y-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                    {SITE.certs.map((c) => (
                      <li key={c.title}>{c.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
