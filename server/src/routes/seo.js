import { Router } from "express";
import { connectDb } from "../lib/db.js";
import { Project, Post, Setting } from "../models/index.js";

export const seoRouter = Router();
const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);
const origin = async (req) => {
  const site = (await Setting.findOne({ key: "site" }).lean())?.value ?? {};
  return String(site.url || process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
};

seoRouter.get("/robots.txt", async (req, res, next) => {
  try {
    await connectDb();
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${await origin(req)}/sitemap.xml\n`);
  } catch (e) { next(e); }
});

// Real URLs only: published projects and posts that are live right now.
seoRouter.get("/sitemap.xml", async (req, res, next) => {
  try {
    await connectDb();
    const base = await origin(req);
    const [projects, posts] = await Promise.all([
      Project.find({ status: "published" }).select("slug updatedAt").lean(),
      Post.find({ status: "published", publishedAt: { $lte: new Date() } }).select("slug updatedAt").lean(),
    ]);
    const u = (path, d) => `<url><loc>${esc(base + path)}</loc>${d ? `<lastmod>${new Date(d).toISOString()}</lastmod>` : ""}</url>`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${u("/")}${u("/blog")}${projects.map((p) => u(`/projects/${p.slug}`, p.updatedAt)).join("")}${posts.map((p) => u(`/blog/${p.slug}`, p.updatedAt)).join("")}</urlset>`;
    res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(xml);
  } catch (e) { next(e); }
});
