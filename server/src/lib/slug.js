export const slugify = (s) =>
  String(s || "").toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "item";

/** Returns a slug unique within Model, appending -2, -3... on clash. */
export async function uniqueSlug(Model, base, excludeId) {
  const root = slugify(base);
  let slug = root, n = 1;
  for (;;) {
    const hit = await Model.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }).select("_id").lean();
    if (!hit) return slug;
    slug = `${root}-${++n}`;
  }
}
