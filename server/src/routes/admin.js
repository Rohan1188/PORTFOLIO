import { Router } from "express";
import sanitizeHtml from "sanitize-html";
import { crud } from "../lib/crud.js";
import { uniqueSlug } from "../lib/slug.js";
import * as S from "../lib/schemas.js";
import * as M from "../models/index.js";
import { mediaRouter } from "./media.js";
import { requireAdmin, requireCsrf, audit } from "../middleware/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAdmin, requireCsrf);

const slugged = (Model, key) => async (data, existing) => {
  if (data[key] !== undefined || data.slug !== undefined || !existing) data.slug = await uniqueSlug(Model, data.slug || data[key] || existing?.[key], existing?._id);
  return data;
};

const cleanHtml = (html) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "figure", "figcaption", "pre", "code", "u"]),
    allowedAttributes: { a: ["href", "name", "target", "rel"], img: ["src", "alt", "width", "height", "loading"], "*": ["class"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });

const publishing = async (data, existing) => {
  if (data.body !== undefined) data.body = cleanHtml(data.body);
  const status = data.status ?? existing?.status;
  if (status === "published" && !data.publishedAt && !existing?.publishedAt) data.publishedAt = new Date();
  return slugged(M.Post, "title")(data, existing);
};

const resources = [
  ["projects", { Model: M.Project, entity: "project", schema: S.projectSchema, search: ["name", "summary", "category"], filters: ["status", "category", "featured"], populate: "cover", beforeSave: slugged(M.Project, "name") }],
  ["skill-categories", { Model: M.SkillCategory, entity: "skill_category", schema: S.skillCategorySchema, search: ["name"] }],
  ["skills", { Model: M.Skill, entity: "skill", schema: S.skillSchema, search: ["name"], filters: ["category", "visible"], populate: "category" }],
  ["services", { Model: M.Service, entity: "service", schema: S.serviceSchema, search: ["title", "description"], filters: ["featured", "visible"], populate: "image" }],
  ["experience", { Model: M.Experience, entity: "experience", schema: S.experienceSchema, search: ["company", "role"], filters: ["visible"] }],
  ["education", { Model: M.Education, entity: "education", schema: S.educationSchema, search: ["degree", "institution"], filters: ["visible"] }],
  ["certifications", { Model: M.Certification, entity: "certification", schema: S.certificationSchema, search: ["title", "issuer"], filters: ["visible"], populate: "file" }],
  ["achievements", { Model: M.Achievement, entity: "achievement", schema: S.achievementSchema, search: ["title"], filters: ["visible"] }],
  ["testimonials", { Model: M.Testimonial, entity: "testimonial", schema: S.testimonialSchema, search: ["name", "feedback", "company"], filters: ["approved", "visible"], populate: "avatar" }],
  ["albums", { Model: M.Album, entity: "album", schema: S.albumSchema, search: ["title"], beforeSave: slugged(M.Album, "title") }],
  ["gallery", { Model: M.GalleryImage, entity: "gallery_image", schema: S.galleryImageSchema, search: ["caption", "category"], filters: ["album", "category", "visible"], populate: "media" }],
  ["post-categories", { Model: M.PostCategory, entity: "post_category", schema: S.postCategorySchema, search: ["name"], sort: { name: 1 }, beforeSave: slugged(M.PostCategory, "name") }],
  ["posts", { Model: M.Post, entity: "post", schema: S.postSchema, search: ["title", "excerpt", "tags"], filters: ["status", "category"], populate: "cover category", sort: { createdAt: -1 }, beforeSave: publishing }],
];
for (const [path, cfg] of resources) adminRouter.use(`/${path}`, crud(cfg));

adminRouter.use("/media", mediaRouter);

// ---------- Enquiries (public submit lives in public.js; these are the inbox tools) ----------
const enquiryRouter = crud({ Model: M.Enquiry, entity: "enquiry", schema: S.enquiryUpdateSchema, search: ["name", "email", "subject", "message"], filters: ["isRead", "archived", "isSpam", "status"], sort: { createdAt: -1 } });
// Inbox rows are created only by the public form; block admin-side creation.
adminRouter.post("/enquiries", (_req, res) => res.status(405).json({ error: "Enquiries are created by the public contact form." }));
adminRouter.use("/enquiries", enquiryRouter);

// ---------- Settings (profile, hero, about, theme, seo, nav, footer, homepage visibility, animation...) ----------
adminRouter.get("/settings", async (_req, res) => {
  const rows = await M.Setting.find().lean();
  res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
});
adminRouter.put("/settings/:key", async (req, res) => {
  if (!S.SETTING_KEYS.includes(req.params.key)) return res.status(404).json({ error: "Unknown setting." });
  const value = S.settingValue.parse(req.body);
  const doc = await M.Setting.findOneAndUpdate({ key: req.params.key }, { value }, { upsert: true, new: true });
  await audit(req, "settings.update", "setting", req.params.key);
  res.json({ key: doc.key, value: doc.value });
});

// ---------- Audit log + dashboard (every number is a real query) ----------
adminRouter.get("/activity", async (req, res) => {
  const limit = Math.min(100, Number(req.query.limit) || 30);
  res.json(await M.Activity.find().sort({ createdAt: -1 }).limit(limit));
});

adminRouter.get("/dashboard", async (_req, res) => {
  const now = new Date(), since = new Date(Date.now() - 29 * 864e5);
  const [projects, published, drafts, posts, publishedPosts, enquiries, unread, skills, testimonials, perDay, byCategory, activity, recentProjects] = await Promise.all([
    M.Project.countDocuments(), M.Project.countDocuments({ status: "published" }), M.Project.countDocuments({ status: "draft" }),
    M.Post.countDocuments(), M.Post.countDocuments({ status: "published", publishedAt: { $lte: now } }),
    M.Enquiry.countDocuments({ isSpam: false }), M.Enquiry.countDocuments({ isSpam: false, isRead: false, archived: false }),
    M.Skill.countDocuments(), M.Testimonial.countDocuments(),
    M.Enquiry.aggregate([{ $match: { createdAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    M.Project.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    M.Activity.find().sort({ createdAt: -1 }).limit(10),
    M.Project.find().sort({ updatedAt: -1 }).limit(5).select("name status updatedAt"),
  ]);
  res.json({
    totals: { projects, published, drafts, posts, publishedPosts, enquiries, unread, skills, testimonials },
    charts: { enquiriesPerDay: perDay.map((d) => ({ date: d._id, count: d.count })), projectsByCategory: byCategory.map((c) => ({ category: c._id, count: c.count })) },
    recentActivity: activity, recentUpdates: recentProjects,
  });
});
