// One config object per content type drives the whole admin list + form UI (and keeps it honest: every field maps to a real API field).
export type FieldDef = {
  key: string; label: string; type: "text" | "textarea" | "number" | "bool" | "select" | "tags" | "lines" | "url" | "datetime" | "richtext" | "media" | "relation";
  options?: string[]; relation?: { path: string; label: string }; mediaKind?: string; help?: string; required?: boolean; default?: any; half?: boolean;
};
export type ResourceDef = {
  path: string; title: string; singular: string; fields: FieldDef[];
  columns: { key: string; label: string; kind?: "pill" | "bool" | "media" | "relation" | "tags" }[];
  filters?: { key: string; label: string; options: string[] }[]; sortable?: boolean;
  bulk?: string[]; quick?: { key: string; on: string; off: string }; preview?: boolean; group: string;
};

const vis: FieldDef = { key: "visible", label: "Visible on site", type: "bool", default: true };
const STATUS = ["draft", "published", "archived"];

export const RESOURCES: ResourceDef[] = [
  { path: "projects", title: "Projects", singular: "project", group: "Content", sortable: true, preview: true, bulk: ["publish", "draft", "archive", "delete"], quick: { key: "featured", on: "Unfeature", off: "Feature" },
    columns: [{ key: "name", label: "Name" }, { key: "category", label: "Category" }, { key: "status", label: "Status", kind: "pill" }, { key: "featured", label: "Featured", kind: "bool" }],
    filters: [{ key: "status", label: "Status", options: STATUS }],
    fields: [
      { key: "name", label: "Name", type: "text", required: true }, { key: "category", label: "Category", type: "text", required: true, help: "e.g. Full Stack, Mobile, AI/ML" },
      { key: "summary", label: "Short summary", type: "textarea", required: true }, { key: "description", label: "Full description", type: "textarea" },
      { key: "problem", label: "Problem", type: "textarea", half: true }, { key: "solution", label: "Solution", type: "textarea", half: true }, { key: "outcome", label: "Outcome", type: "textarea" },
      { key: "tech", label: "Technologies used", type: "tags", help: "Press Enter or comma after each" },
      { key: "githubUrl", label: "GitHub link", type: "url", half: true }, { key: "demoUrl", label: "Live website link", type: "url", half: true },
      { key: "cover", label: "Cover image", type: "media", mediaKind: "image" },
      { key: "confidential", label: "Confidential client work (hide repo link publicly)", type: "bool" }, { key: "featured", label: "Featured", type: "bool" },
      { key: "status", label: "Status", type: "select", options: STATUS, default: "draft" },
    ] },
  { path: "skill-categories", title: "Skill categories", singular: "category", group: "Content", sortable: true, bulk: ["show", "hide", "delete"],
    columns: [{ key: "name", label: "Name" }, { key: "visible", label: "Visible", kind: "bool" }], fields: [{ key: "name", label: "Name", type: "text", required: true }, vis] },
  { path: "skills", title: "Skills", singular: "skill", group: "Content", sortable: true, bulk: ["show", "hide", "delete"], quick: { key: "visible", on: "Hide", off: "Show" },
    columns: [{ key: "name", label: "Skill" }, { key: "category", label: "Category", kind: "relation" }, { key: "level", label: "Level %" }, { key: "visible", label: "Visible", kind: "bool" }],
    fields: [
      { key: "name", label: "Name", type: "text", required: true }, { key: "category", label: "Category", type: "relation", relation: { path: "skill-categories", label: "name" }, required: true },
      { key: "level", label: "Proficiency (0–100)", type: "number", default: 80, half: true }, { key: "icon", label: "Icon (optional)", type: "text", half: true },
      { key: "description", label: "Description", type: "text" }, vis,
    ] },
  { path: "services", title: "Services", singular: "service", group: "Content", sortable: true, bulk: ["show", "hide", "delete"], quick: { key: "featured", on: "Unfeature", off: "Feature" },
    columns: [{ key: "title", label: "Title" }, { key: "price", label: "Price" }, { key: "featured", label: "Featured", kind: "bool" }, { key: "visible", label: "Visible", kind: "bool" }],
    fields: [
      { key: "title", label: "Title", type: "text", required: true }, { key: "description", label: "Description", type: "textarea", required: true },
      { key: "icon", label: "Icon name", type: "text", half: true }, { key: "price", label: "Pricing (optional)", type: "text", half: true }, { key: "ctaLabel", label: "Button label", type: "text" },
      { key: "image", label: "Image", type: "media", mediaKind: "image" }, { key: "featured", label: "Featured", type: "bool" }, vis,
    ] },
  { path: "experience", title: "Experience", singular: "experience", group: "Content", sortable: true, bulk: ["show", "hide", "delete"],
    columns: [{ key: "role", label: "Position" }, { key: "company", label: "Company" }, { key: "startLabel", label: "From" }, { key: "endLabel", label: "To" }],
    fields: [
      { key: "company", label: "Company", type: "text", required: true, half: true }, { key: "role", label: "Position", type: "text", required: true, half: true },
      { key: "location", label: "Location", type: "text", half: true }, { key: "companyUrl", label: "Company website", type: "url", half: true },
      { key: "startLabel", label: "Start (e.g. Jul 2025)", type: "text", required: true, half: true }, { key: "endLabel", label: "End (or Present)", type: "text", required: true, half: true },
      { key: "points", label: "Responsibilities (one per line)", type: "lines" }, { key: "tech", label: "Technologies", type: "tags" }, vis,
    ] },
  { path: "education", title: "Education", singular: "education record", group: "Content", sortable: true, bulk: ["show", "hide", "delete"],
    columns: [{ key: "degree", label: "Degree" }, { key: "institution", label: "Institution" }, { key: "yearLabel", label: "Dates" }],
    fields: [
      { key: "degree", label: "Degree", type: "text", required: true, half: true }, { key: "institution", label: "Institution", type: "text", required: true, half: true },
      { key: "subject", label: "Subject", type: "text", half: true }, { key: "location", label: "Location", type: "text", half: true }, { key: "yearLabel", label: "Dates (e.g. 2022 – 2026)", type: "text", required: true },
      { key: "coursework", label: "Coursework", type: "text" }, { key: "achievement", label: "Achievement", type: "text" }, { key: "description", label: "Description", type: "textarea" }, vis,
    ] },
  { path: "certifications", title: "Certifications", singular: "certification", group: "Content", sortable: true, bulk: ["show", "hide", "delete"],
    columns: [{ key: "title", label: "Title" }, { key: "issuer", label: "Issuer" }, { key: "yearLabel", label: "Issued" }],
    fields: [
      { key: "title", label: "Title", type: "text", required: true }, { key: "issuer", label: "Issuing organization", type: "text", required: true, half: true }, { key: "yearLabel", label: "Issue date", type: "text", required: true, half: true },
      { key: "credentialId", label: "Credential ID", type: "text", half: true }, { key: "verifyUrl", label: "Credential link", type: "url", half: true },
      { key: "file", label: "Certificate file (PDF or image)", type: "media", mediaKind: "certificate" }, vis,
    ] },
  { path: "achievements", title: "Achievements", singular: "achievement", group: "Content", sortable: true, bulk: ["show", "hide", "delete"],
    columns: [{ key: "title", label: "Title" }, { key: "dateLabel", label: "When" }],
    fields: [{ key: "title", label: "Title", type: "text", required: true }, { key: "dateLabel", label: "Date", type: "text", half: true }, { key: "icon", label: "Icon", type: "text", half: true }, { key: "description", label: "Description", type: "textarea" }, vis] },
  { path: "testimonials", title: "Testimonials", singular: "testimonial", group: "Content", sortable: true, bulk: ["approve", "unapprove", "show", "hide", "delete"], quick: { key: "approved", on: "Unapprove", off: "Approve" },
    columns: [{ key: "name", label: "Name" }, { key: "company", label: "Company" }, { key: "approved", label: "Approved", kind: "bool" }, { key: "visible", label: "Visible", kind: "bool" }],
    fields: [
      { key: "name", label: "Client name", type: "text", required: true, half: true }, { key: "position", label: "Position", type: "text", half: true }, { key: "company", label: "Company", type: "text" },
      { key: "feedback", label: "Feedback", type: "textarea", required: true }, { key: "rating", label: "Rating (1–5)", type: "number", half: true },
      { key: "avatar", label: "Profile image", type: "media", mediaKind: "image" },
      { key: "approved", label: "Approved (only approved testimonials appear on the site)", type: "bool" }, vis,
    ] },
  { path: "posts", title: "Blog posts", singular: "post", group: "Content", preview: true, bulk: ["publish", "draft", "archive", "delete"],
    columns: [{ key: "title", label: "Title" }, { key: "status", label: "Status", kind: "pill" }, { key: "publishedAt", label: "Publish date" }],
    filters: [{ key: "status", label: "Status", options: STATUS }],
    fields: [
      { key: "title", label: "Title", type: "text", required: true }, { key: "excerpt", label: "Excerpt", type: "textarea" }, { key: "body", label: "Article", type: "richtext" },
      { key: "category", label: "Category", type: "relation", relation: { path: "post-categories", label: "name" }, half: true }, { key: "readTime", label: "Read time (e.g. 5 min)", type: "text", half: true },
      { key: "tags", label: "Tags", type: "tags" }, { key: "cover", label: "Featured image", type: "media", mediaKind: "image" },
      { key: "seoTitle", label: "SEO title", type: "text", half: true }, { key: "seoDescription", label: "SEO description", type: "text", half: true },
      { key: "status", label: "Status", type: "select", options: STATUS, default: "draft" },
      { key: "publishedAt", label: "Publish date/time (future date = scheduled)", type: "datetime", help: "Leave empty to publish immediately when status is Published." },
    ] },
  { path: "post-categories", title: "Blog categories", singular: "category", group: "Content", bulk: ["delete"],
    columns: [{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }], fields: [{ key: "name", label: "Name", type: "text", required: true }] },
  { path: "albums", title: "Gallery albums", singular: "album", group: "Content", sortable: true, bulk: ["show", "hide", "delete"],
    columns: [{ key: "title", label: "Title" }, { key: "visible", label: "Visible", kind: "bool" }], fields: [{ key: "title", label: "Title", type: "text", required: true }, { key: "description", label: "Description", type: "text" }, vis] },
  { path: "gallery", title: "Gallery images", singular: "image", group: "Content", sortable: true, bulk: ["show", "hide", "delete"],
    columns: [{ key: "media", label: "Image", kind: "media" }, { key: "caption", label: "Caption" }, { key: "category", label: "Category" }, { key: "visible", label: "Visible", kind: "bool" }],
    fields: [
      { key: "media", label: "Image", type: "media", mediaKind: "image", required: true }, { key: "album", label: "Album", type: "relation", relation: { path: "albums", label: "title" }, half: true },
      { key: "category", label: "Category", type: "text", half: true }, { key: "caption", label: "Caption", type: "text" }, vis,
    ] },
];
