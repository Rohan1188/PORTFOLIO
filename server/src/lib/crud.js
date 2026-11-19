import { Router } from "express";
import mongoose from "mongoose";
import { audit } from "../middleware/auth.js";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const BULK = {
  delete: null, publish: { status: "published" }, draft: { status: "draft" }, archive: { status: "archived" },
  show: { visible: true }, hide: { visible: false }, approve: { approved: true }, unapprove: { approved: false },
};

/**
 * Generic admin CRUD router: list (search/filter/paginate), get, create, update, delete, drag-and-drop reorder, bulk actions.
 * Every write is validated by a zod schema, persisted through Mongoose and recorded in the audit log.
 */
export function crud({ Model, entity, schema, search = [], sort = { sortOrder: 1, createdAt: -1 }, populate = "", filters = [], beforeSave }) {
  const r = Router();
  const bad = (res, msg = "Invalid id.") => res.status(400).json({ error: msg });
  const label = (d) => d.name || d.title || d.company || d.degree || d.slug || "";

  r.get("/", async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const q = {};
    const term = String(req.query.q || "").trim().slice(0, 100);
    if (term && search.length) q.$or = search.map((f) => ({ [f]: { $regex: esc(term), $options: "i" } }));
    for (const f of filters) if (req.query[f] !== undefined && req.query[f] !== "") q[f] = ["true", "false"].includes(req.query[f]) ? req.query[f] === "true" : String(req.query[f]);
    const [items, total] = await Promise.all([
      Model.find(q).populate(populate || []).sort(sort).skip((page - 1) * limit).limit(limit),
      Model.countDocuments(q),
    ]);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  });

  r.get("/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res);
    const doc = await Model.findById(req.params.id).populate(populate || []);
    doc ? res.json(doc) : res.status(404).json({ error: "Not found." });
  });

  r.post("/", async (req, res) => {
    let data = schema.parse(req.body);
    if (beforeSave) data = await beforeSave(data, null);
    const doc = await Model.create(data);
    await audit(req, `${entity}.create`, entity, doc.id, label(doc));
    res.status(201).json(doc);
  });

  r.patch("/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res);
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found." });
    let data = schema.partial().parse(req.body);
    if (beforeSave) data = await beforeSave(data, doc);
    doc.set(data); await doc.save();
    await audit(req, `${entity}.update`, entity, doc.id, label(doc));
    res.json(doc);
  });

  r.delete("/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return bad(res);
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found." });
    await audit(req, `${entity}.delete`, entity, doc.id, label(doc));
    res.json({ ok: true });
  });

  r.post("/reorder", async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter((i) => mongoose.isValidObjectId(i)).slice(0, 500) : [];
    if (!ids.length) return bad(res, "ids required.");
    await Model.bulkWrite(ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { $set: { sortOrder: i } } } })));
    await audit(req, `${entity}.reorder`, entity, undefined, `${ids.length} items`);
    res.json({ ok: true });
  });

  r.post("/bulk", async (req, res) => {
    const { action } = req.body ?? {};
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.filter((i) => mongoose.isValidObjectId(i)).slice(0, 200) : [];
    if (!ids.length || !(action in BULK)) return bad(res, "Valid action and ids required.");
    const result = action === "delete" ? await Model.deleteMany({ _id: { $in: ids } }) : await Model.updateMany({ _id: { $in: ids } }, { $set: BULK[action] });
    await audit(req, `${entity}.bulk_${action}`, entity, undefined, `${ids.length} items`);
    res.json({ ok: true, affected: result.deletedCount ?? result.modifiedCount });
  });

  return r;
}
