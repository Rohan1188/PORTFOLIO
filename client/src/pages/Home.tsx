import { useEffect } from "react";
import Nav from "../components/Nav";
import SectionSpine from "../components/SectionSpine";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Projects from "../components/Projects";
import Services from "../components/Services";
import Resume from "../components/Resume";
import Certifications from "../components/Certifications";
import GithubSection from "../components/GithubSection";
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import StatsBar from "../components/StatsBar";
import TechMarquee from "../components/TechMarquee";
import Ornament from "../components/Ornament";
import { Testimonials, Achievements, Gallery } from "../components/Extras";
import { useSite, useSeo } from "../lib/site";

export default function Home() {
  const SITE = useSite();
  const on = (k: string) => SITE.homepage[k] !== false; // admin can hide any section; unknown keys stay visible
  const title = `${SITE.name} — ${SITE.role}`;
  const description = `${SITE.name} — ${SITE.role}. Based in ${SITE.location}.`;
  useSeo(title, description, SITE.profileImage);

  // Structured data (schema.org Person), built from live profile data.
  useEffect(() => {
    const el = document.createElement("script"); el.type = "application/ld+json";
    el.text = JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: SITE.name, jobTitle: SITE.role, address: { "@type": "PostalAddress", addressCountry: SITE.location }, email: SITE.email, sameAs: [SITE.socials.github, SITE.socials.linkedin].filter(Boolean) });
    document.head.appendChild(el); return () => { el.remove(); };
  }, [SITE.name, SITE.role, SITE.location, SITE.email, SITE.socials.github, SITE.socials.linkedin]);

  return (
    <>
      <SectionSpine />
      <Nav />
      <main id="main-content">
        {on("hero") && <Hero />}
        {on("hero") && <StatsBar />}
        {on("about") && <About />}
        {on("skills") && <Skills />}
        {on("skills") && <TechMarquee />}
        {on("services") && <Services />}
        {on("projects") && <Projects />}
        {on("experience") && <Experience />}
        {on("education") && <Education />}
        {on("achievements") && <Achievements />}
        {on("resume") && <Resume />}
        {on("certifications") && <Certifications />}
        {on("github") && SITE.githubUsername && <GithubSection />}
        {on("gallery") && <Gallery />}
        {on("testimonials") && <Testimonials />}
        {on("blog") && <Blog />}
        {SITE.theme.patterns !== false && <Ornament />}
        {on("contact") && <Contact />}
      </main>
      <Footer />
    </>
  );
}
