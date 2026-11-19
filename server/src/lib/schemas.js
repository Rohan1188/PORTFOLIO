import { z } from "zod";

const ctl = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
export const clean = (s) => s.replace(ctl, "").trim();
const text = (max = 200) => z.string().transform(clean).pipe(z.string().max(max));
const req = (max = 200, label = "This field") => z.string().transform(clean).pipe(z.string().min(1, `${label} is required.`).max(max));
const url = z.string().trim().max(500).refine((v) => v === "" || v === "#" || /^(https?:\/\/|\/|mailto:)/i.test(v), "Must be an http(s) URL or a relative path.");
const oid = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const list = (max = 60) => z.array(text(max)).max(50);
const ord = { sortOrder: z.number().int().optional(), visible: z.boolean().optional() };
const status = z.enum(["draft", "published", "archived"]);

export const projectSchema = z.object({
  name: req(150, "Name"), slug: text(100).optional(), category: req(60, "Category"), summary: req(400, "Summary"),
  description: text(20000).optional(), problem: text(4000).optional(), solution: text(4000).optional(), outcome: text(4000).optional(),
  tech: list(), githubUrl: url.optional(), demoUrl: url.optional(), cover: oid.nullable().optional(),
  images: z.array(z.object({ media: oid, caption: text(200).optional() })).max(30).optional(),
  confidential: z.boolean().optional(), featured: z.boolean().optional(), status: status.optional(), sortOrder: z.number().int().optional(),
});
export const skillCategorySchema = z.object({ name: req(80, "Name"), ...ord });
export const skillSchema = z.object({ category: oid, name: req(80, "Name"), icon: text(60).optional(), description: text(300).optional(), level: z.number().int().min(0).max(100).optional(), ...ord });
export const serviceSchema = z.object({ title: req(120, "Title"), description: req(1000, "Description"), icon: text(60).optional(), image: oid.nullable().optional(), price: text(60).optional(), ctaLabel: text(60).optional(), featured: z.boolean().optional(), ...ord });
export const experienceSchema = z.object({ company: req(120, "Company"), role: req(120, "Position"), location: text(120).optional(), startLabel: req(40, "Start"), endLabel: req(40, "End"), companyUrl: url.optional(), points: z.array(text(600)).max(30), tech: list(), ...ord });
export const educationSchema = z.object({ degree: req(160, "Degree"), institution: req(160, "Institution"), location: text(120).optional(), subject: text(120).optional(), yearLabel: req(40, "Dates"), coursework: text(400).optional(), achievement: text(300).optional(), description: text(2000).optional(), ...ord });
export const certificationSchema = z.object({ title: req(200, "Title"), issuer: req(120, "Issuer"), yearLabel: req(40, "Date"), credentialId: text(80).optional(), verifyUrl: url.optional(), file: oid.nullable().optional(), ...ord });
export const achievementSchema = z.object({ title: req(160, "Title"), description: text(1000).optional(), dateLabel: text(40).optional(), icon: text(60).optional(), ...ord });
export const testimonialSchema = z.object({ name: req(100, "Name"), position: text(120).optional(), company: text(120).optional(), feedback: req(2000, "Feedback"), avatar: oid.nullable().optional(), rating: z.number().int().min(1).max(5).optional(), approved: z.boolean().optional(), ...ord });
export const albumSchema = z.object({ title: req(120, "Title"), slug: text(100).optional(), description: text(500).optional(), ...ord });
export const galleryImageSchema = z.object({ album: oid.nullable().optional(), media: oid, caption: text(300).optional(), category: text(60).optional(), ...ord });
export const postCategorySchema = z.object({ name: req(80, "Name"), slug: text(100).optional() });
export const postSchema = z.object({
  title: req(200, "Title"), slug: text(100).optional(), excerpt: text(500).optional(), body: z.string().max(200_000).optional(),
  category: oid.nullable().optional(), tags: list(40), readTime: text(20).optional(), cover: oid.nullable().optional(),
  seoTitle: text(70).optional(), seoDescription: text(170).optional(), status: status.optional(),
  publishedAt: z.coerce.date().nullable().optional(),
});
export const enquiryUpdateSchema = z.object({
  status: z.enum(["new", "in_progress", "replied", "closed"]).optional(), isRead: z.boolean().optional(), isSpam: z.boolean().optional(),
  archived: z.boolean().optional(), internalNotes: text(4000).optional(),
});

export const PROJECT_TYPES = ["Website", "Web app", "Mobile app", "CRM / management system", "Machine learning", "Other"];
export const contactSchema = z.object({
  name: req(100, "Name"),
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address.").max(254)),
  subject: req(150, "Subject"),
  message: z.string().transform(clean).pipe(z.string().min(10, "Message must be at least 10 characters.").max(5000)),
  projectType: z.enum(PROJECT_TYPES).optional().or(z.literal("").transform(() => undefined)),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export const loginSchema = z.object({ email: z.string().trim().toLowerCase().pipe(z.email().max(254)), password: z.string().min(1).max(256) });
export const MIN_PASSWORD = 12;
export const newPassword = z.string().min(MIN_PASSWORD, `Password must be at least ${MIN_PASSWORD} characters.`).max(256);

// Editable site-wide JSON documents (profile, hero, about, site, seo, theme, footer, nav, homepage, animation, stats, contact).
export const SETTING_KEYS = ["profile", "hero", "about", "site", "seo", "theme", "footer", "nav", "homepage", "animation", "stats", "contact", "social"];
export const settingValue = z.record(z.string(), z.any()).refine((v) => JSON.stringify(v).length <= 60_000, "Setting is too large.");
