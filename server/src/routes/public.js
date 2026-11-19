import { Router } from "express";
import * as M from "../models/index.js";
import { contactSchema } from "../lib/schemas.js";
import { rateLimit, clientIp } from "../middleware/rateLimit.js";
import { hmacHex } from "../lib/crypto.js";
import { env } from "../lib/env.js";

export const publicRouter = Router();
const cache = (sec) => (_req, res, next) => { res.set("Cache-Control", `public, max-age=${sec}, stale-while-revalidate=${sec * 5}`); next(); };
const visible = { visible: true };
const live = () => ({ status: "published", publishedAt: { $lte: new Date() } });
const sorted = { sortOrder: 1, createdAt: 1 };

publicRouter.get("/site", cache(30), async (_req, res) => {
  const rows = await M.Setting.find().lean();
  res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
});

const hideLinks = (p) => { const o = p.toJSON(); if (o.confidential) { delete o.githubUrl; } return o; };
publicRouter.get("/projects", cache(30), async (_req, res) => {
  const items = await M.Project.find({ status: "published" }).populate("cover").sort({ featured: -1, sortOrder: 1, createdAt: -1 });
  res.json(items.map(hideLinks));
});
publicRouter.get("/projects/:slug", cache(30), async (req, res) => {
  const p = await M.Project.findOne({ slug: req.params.slug, status: "published" }).populate("cover images.media");
  p ? res.json(hideLinks(p)) : res.status(404).json({ error: "Not found." });
});

publicRouter.get("/skills", cache(30), async (_req, res) => {
  const [cats, skills] = await Promise.all([M.SkillCategory.find(visible).sort(sorted).lean({ virtuals: true }), M.Skill.find(visible).sort(sorted).lean()]);
  res.json(cats.map((c) => ({ id: String(c._id), name: c.name, items: skills.filter((s) => String(s.category) === String(c._id)).map((s) => ({ id: String(s._id), name: s.name, icon: s.icon, level: s.level, description: s.description })) })).filter((c) => c.items.length));
});

for (const [path, Model, populate] of [["services", M.Service, "image"], ["experience", M.Experience, ""], ["education", M.Education, ""], ["certifications", M.Certification, "file"], ["achievements", M.Achievement, ""]]) {
  publicRouter.get(`/${path}`, cache(30), async (_req, res) => res.json(await Model.find(visible).populate(populate || []).sort(sorted)));
}
publicRouter.get("/testimonials", cache(30), async (_req, res) => res.json(await M.Testimonial.find({ ...visible, approved: true }).populate("avatar").sort(sorted)));

publicRouter.get("/gallery", cache(30), async (_req, res) => {
  const [albums, images] = await Promise.all([M.Album.find(visible).sort(sorted), M.GalleryImage.find(visible).populate("media").sort(sorted)]);
  res.json({ albums, images });
});

publicRouter.get("/posts", cache(30), async (_req, res) =>
  res.json(await M.Post.find(live()).select("-body").populate("cover category").sort({ publishedAt: -1 })));
publicRouter.get("/posts/:slug", cache(30), async (req, res) => {
  const p = await M.Post.findOne({ slug: req.params.slug, ...live() }).populate("cover category");
  p ? res.json(p) : res.status(404).json({ error: "Not found." });
});

// Contact form: honeypot, validation, rate limit, hashed IP. Stored for real in MongoDB.
publicRouter.post("/contact", rateLimit("contact", 5, 600), async (req, res) => {
  const data = contactSchema.parse(req.body ?? {});
  const { website, ...fields } = data;
  if (website) return res.json({ ok: true }); // bots get a silent success
  const doc = await M.Enquiry.create({ ...fields, ipHash: await hmacHex(env().ipHashSecret, clientIp(req)) });
  res.status(201).json({ ok: true, id: doc.id });
});

// GitHub activity proxy (cached upstream for an hour). Username must look like a GitHub login.
const ghCache = new Map();
publicRouter.get("/github", cache(3600), async (req, res) => {
  const user = String(req.query.user || "");
  if (!/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(user)) return res.status(400).json({ ok: false, error: "Invalid user." });
  const hit = ghCache.get(user);
  if (hit && hit.exp > Date.now()) return res.json(hit.data);
  try {
    const h = { Accept: "application/vnd.github+json", "User-Agent": "portfolio" };
    const [u, r] = await Promise.all([fetch(`https://api.github.com/users/${user}`, { headers: h }), fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=4`, { headers: h })]);
    if (!u.ok) return res.status(502).json({ ok: false, error: "GitHub user not found or rate-limited." });
    const ud = await u.json(), rd = r.ok ? await r.json() : [];
    const data = { ok: true, user: { public_repos: ud.public_repos, followers: ud.followers, public_gists: ud.public_gists }, repos: (Array.isArray(rd) ? rd : []).map((x) => ({ name: x.name, html_url: x.html_url, language: x.language, stargazers_count: x.stargazers_count })) };
    ghCache.set(user, { data, exp: Date.now() + 3600_000 });
    res.json(data);
  } catch { res.status(502).json({ ok: false, error: "Failed to reach GitHub API." }); }
});
