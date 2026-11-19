// Loads the content that used to be hardcoded in lib/data.ts into MongoDB.
// SAFE: it only fills collections/settings that are EMPTY. It never deletes or overwrites anything, and never touches admin users.
import { connectDb } from "../src/lib/db.js";
import * as M from "../src/models/index.js";
import { slugify } from "../src/lib/slug.js";
import { SITE } from "./../seed/site-data.js";
import mongoose from "mongoose";

const link = (v) => (v && v !== "#" && v !== "—" ? v : undefined);
await connectDb();
const log = (...a) => console.log(...a);
const empty = async (Model) => (await Model.estimatedDocumentCount()) === 0;
const ordered = (arr) => arr.map((x, i) => ({ ...x, sortOrder: i }));

async function setting(key, value) {
  if (!(await M.Setting.exists({ key }))) { await M.Setting.create({ key, value }); log("  + setting", key); }
}

await setting("profile", { name: SITE.name, designation: SITE.role, location: SITE.location, email: SITE.email, phone: SITE.phone, cvUrl: SITE.cvUrl, githubUsername: SITE.githubUsername, status: "Open to work" });
await setting("hero", { roles: SITE.roles, intro: "I design and ship full-stack products end to end — from React interfaces to the Docker containers they run in. Most recently I've been deep in developer platforms, and APIs that hold up under real traffic." });
await setting("about", { headline: "A curious, driven computer science student who ships real client work.", paragraphs: [
  `I'm a curious and driven computer science student based in ${SITE.location}, completed my B.Tech in Computer Science & Engineering at KIIT, Bhubaneswar (2022–2026). I'm always looking for opportunities to grow and make an impact.`,
  "I serve as Manager at OS Group of Company, IT Head and full-stack developer at Nepal Living Connecting IT Solution — moving between MERN builds, WordPress migrations, and Python/ML projects depending on what a client needs that week.",
  "Outside of client work, I volunteer with the Art of Giving Movement, and stay curious about AI/ML, problem solving, and emerging technology. I speak English, Nepali and Hindi fluently.",
] });
await setting("footer", { blurb: `Manager at OS GROUP OF COMPANY & Full-stack developer & DevOps engineer, building scalable software from ${SITE.location}.` });
await setting("social", SITE.socials);
await setting("stats", { items: SITE.stats });
await setting("homepage", { sections: { hero: true, about: true, skills: true, experience: true, projects: true, services: true, resume: true, blog: true, testimonials: true, contact: true } });
await setting("theme", { primary: "#DC143C", gold: "#D4AF37", himalayanBackdrop: true, flagAccent: true, patterns: true });
await setting("animation", { enabled: true, parallax: true, customCursor: true, loader: true });
await setting("site", { title: `${SITE.name} — Portfolio`, tagline: SITE.role });

if (await empty(M.SkillCategory)) {
  for (const [i, g] of SITE.skills.entries()) {
    const cat = await M.SkillCategory.create({ name: g.group, sortOrder: i });
    await M.Skill.insertMany(g.items.map((s, j) => ({ category: cat._id, name: s.name, level: s.level, sortOrder: j })));
  }
  log("  + skills");
}
if (await empty(M.Experience)) { await M.Experience.insertMany(ordered(SITE.experience.map((e) => ({ company: e.company, role: e.role, location: e.location, startLabel: e.start, endLabel: e.end, points: e.points, tech: e.tech })))); log("  + experience"); }
if (await empty(M.Education)) { await M.Education.insertMany(ordered(SITE.education.map((e) => ({ degree: e.degree, institution: e.institution, location: e.location, yearLabel: e.year, coursework: e.coursework, achievement: e.achievement })))); log("  + education"); }
if (await empty(M.Service)) { await M.Service.insertMany(ordered(SITE.services.map((s) => ({ title: s.title, description: s.desc })))); log("  + services"); }
if (await empty(M.Certification)) { await M.Certification.insertMany(ordered(SITE.certs.map((c) => ({ title: c.title, issuer: c.org, yearLabel: c.date, credentialId: link(c.id), verifyUrl: link(c.link) })))); log("  + certifications"); }
if (await empty(M.Project)) {
  const used = new Set();
  await M.Project.insertMany(ordered(SITE.projects.map((p) => {
    let slug = slugify(p.name), n = 1; while (used.has(slug)) slug = `${slugify(p.name)}-${++n}`; used.add(slug);
    return { slug, name: p.name.trim(), category: p.category, summary: p.desc, description: p.long, tech: p.tech, githubUrl: link(p.github), demoUrl: link(p.demo), status: "published" };
  })));
  log("  + projects");
}
if (await empty(M.Post)) {
  const cats = {};
  for (const b of SITE.blog) if (!cats[b.category]) cats[b.category] = await M.PostCategory.create({ name: b.category, slug: slugify(b.category) });
  const used = new Set();
  await M.Post.insertMany(SITE.blog.map((b) => {
    let slug = slugify(b.title); while (used.has(slug)) slug += "-2"; used.add(slug);
    // Only the excerpt existed in the original site; the full article body is yours to write in the admin editor.
    return { slug, title: b.title, excerpt: b.desc, body: `<p>${b.desc}</p>`, category: cats[b.category]._id, tags: b.tags, readTime: b.readTime, status: "published", publishedAt: new Date(`${b.date}-01-01`) };
  }));
  log("  + blog posts");
}
log("Seed complete.");
await mongoose.disconnect();
