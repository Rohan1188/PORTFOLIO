import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const STATUS = ["draft", "published", "archived"];
const common = { sortOrder: { type: Number, default: 0, index: true }, visible: { type: Boolean, default: true } };
const make = (name, def, opts = { timestamps: true }) => models[name] || model(name, new Schema(def, opts));

// ---------- Auth ----------
export const AdminUser = make("AdminUser", {
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  lastLoginAt: Date,
});

export const Session = make(
  "Session",
  {
    _id: { type: String }, // SHA-256 of the cookie token; the raw token is never stored
    userId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true, index: true },
    csrfToken: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // Mongo TTL cleanup
    userAgent: String,
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// ---------- Settings: one validated JSON document per key (profile, about, hero, site, seo, theme, footer, nav, homepage, animation) ----------
export const Setting = make("Setting", { key: { type: String, required: true, unique: true }, value: { type: Schema.Types.Mixed, default: {} } });

// ---------- Media (files live in object storage; this is the metadata) ----------
export const Media = make("Media", {
  kind: { type: String, enum: ["image", "resume", "certificate", "file"], default: "image" },
  storageKey: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  filename: String,
  mimeType: String,
  sizeBytes: Number,
  width: Number,
  height: Number,
  altText: String,
});

// ---------- Content ----------
export const Project = make("Project", {
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  summary: { type: String, required: true },
  description: { type: String, default: "" },
  problem: String, solution: String, outcome: String,
  tech: [String],
  githubUrl: String, demoUrl: String,
  cover: { type: Schema.Types.ObjectId, ref: "Media" },
  images: [{ media: { type: Schema.Types.ObjectId, ref: "Media" }, caption: String }],
  confidential: { type: Boolean, default: false }, // hides repo links publicly
  featured: { type: Boolean, default: false, index: true },
  status: { type: String, enum: STATUS, default: "draft", index: true },
  sortOrder: { type: Number, default: 0 },
});

export const SkillCategory = make("SkillCategory", { name: { type: String, required: true, unique: true }, ...common });
export const Skill = make("Skill", {
  category: { type: Schema.Types.ObjectId, ref: "SkillCategory", required: true, index: true },
  name: { type: String, required: true },
  icon: String, description: String,
  level: { type: Number, min: 0, max: 100, default: 80 }, // proficiency %, editable per skill
  ...common,
});

export const Service = make("Service", {
  title: { type: String, required: true }, description: { type: String, required: true },
  icon: String, image: { type: Schema.Types.ObjectId, ref: "Media" },
  price: String, ctaLabel: String, featured: { type: Boolean, default: false }, ...common,
});

export const Experience = make("Experience", {
  company: { type: String, required: true }, role: { type: String, required: true }, location: { type: String, default: "" },
  startLabel: { type: String, required: true }, endLabel: { type: String, required: true },
  companyUrl: String, points: [String], tech: [String], ...common,
});

export const Education = make("Education", {
  degree: { type: String, required: true }, institution: { type: String, required: true }, location: { type: String, default: "" },
  subject: String, yearLabel: { type: String, required: true }, coursework: String, achievement: String, description: String, ...common,
});

export const Certification = make("Certification", {
  title: { type: String, required: true }, issuer: { type: String, required: true }, yearLabel: { type: String, required: true },
  credentialId: String, verifyUrl: String, file: { type: Schema.Types.ObjectId, ref: "Media" }, ...common,
});

export const Achievement = make("Achievement", {
  title: { type: String, required: true }, description: String, dateLabel: String, icon: String, ...common,
});

export const Testimonial = make("Testimonial", {
  name: { type: String, required: true }, position: String, company: String, feedback: { type: String, required: true },
  avatar: { type: Schema.Types.ObjectId, ref: "Media" }, rating: { type: Number, min: 1, max: 5 },
  approved: { type: Boolean, default: false, index: true }, ...common,
});

export const Album = make("Album", { slug: { type: String, required: true, unique: true }, title: { type: String, required: true }, description: String, ...common });
export const GalleryImage = make("GalleryImage", {
  album: { type: Schema.Types.ObjectId, ref: "Album", index: true }, media: { type: Schema.Types.ObjectId, ref: "Media", required: true },
  caption: String, category: String, ...common,
});

export const PostCategory = make("PostCategory", { slug: { type: String, required: true, unique: true }, name: { type: String, required: true } });
export const Post = make("Post", {
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true }, excerpt: { type: String, default: "" },
  body: { type: String, default: "" }, // sanitized HTML from the rich-text editor
  category: { type: Schema.Types.ObjectId, ref: "PostCategory" }, tags: [String], readTime: String,
  cover: { type: Schema.Types.ObjectId, ref: "Media" },
  seoTitle: String, seoDescription: String,
  status: { type: String, enum: STATUS, default: "draft", index: true },
  // Public = status "published" AND publishedAt <= now. A future date = scheduled publishing.
  publishedAt: { type: Date, index: true },
});

// ---------- Enquiries ----------
export const Enquiry = make("Enquiry", {
  name: { type: String, required: true }, email: { type: String, required: true }, subject: { type: String, required: true },
  projectType: String, message: { type: String, required: true },
  status: { type: String, enum: ["new", "in_progress", "replied", "closed"], default: "new" },
  isRead: { type: Boolean, default: false, index: true }, isSpam: { type: Boolean, default: false },
  archived: { type: Boolean, default: false, index: true }, internalNotes: String, ipHash: String,
});

// ---------- Audit log ----------
export const Activity = make(
  "Activity",
  { userId: { type: Schema.Types.ObjectId, ref: "AdminUser" }, action: { type: String, required: true }, entity: { type: String, required: true }, entityId: String, detail: String },
  { timestamps: { createdAt: true, updatedAt: false } },
);
