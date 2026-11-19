import express, { Router } from "express";
import { Media, Project, Post, Service, Certification, Testimonial, GalleryImage } from "../models/index.js";
import { crud } from "../lib/crud.js";
import { audit } from "../middleware/auth.js";
import { randomToken } from "../lib/crypto.js";
import { sniff, safeName, ALLOWED, MAX_BYTES } from "../lib/upload.js";
import { storage } from "../lib/storage.js";
import { z } from "zod";

export const mediaRouter = Router();

// Binary upload: POST /api/admin/media?kind=image  body = raw file bytes, header x-filename (URL-encoded).
mediaRouter.post("/", express.raw({ type: () => true, limit: MAX_BYTES }), async (req, res) => {
  const kind = String(req.query.kind || "image");
  if (!ALLOWED[kind]) return res.status(400).json({ error: "Unknown upload kind." });
  const buf = req.body;
  if (!Buffer.isBuffer(buf) || !buf.length) return res.status(400).json({ error: "No file received." });
  if (buf.length > MAX_BYTES) return res.status(413).json({ error: "File is larger than 8 MB." });
  const found = sniff(buf);
  if (!found || !ALLOWED[kind].includes(found.type)) return res.status(415).json({ error: `Unsupported file type for ${kind}. Allowed: ${ALLOWED[kind].join(", ")}.` });
  const d = new Date();
  const storageKey = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${randomToken(14)}.${found.ext}`;
  await storage().put(storageKey, buf, found.type);
  let filename = "file"; try { filename = decodeURIComponent(req.get("x-filename") || "file"); } catch {}
  const doc = await Media.create({ kind, storageKey, url: `/media/${storageKey}`, filename: safeName(filename), mimeType: found.type, sizeBytes: buf.length, altText: String(req.query.alt || "").slice(0, 200) });
  await audit(req, "media.upload", "media", doc.id, doc.filename);
  res.status(201).json(doc);
});

// Replace the bytes of an existing asset in place, so every page that uses it updates (image replacement).
mediaRouter.put("/:id/replace", express.raw({ type: () => true, limit: MAX_BYTES }), async (req, res) => {
  const doc = await Media.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found." });
  const buf = req.body, found = Buffer.isBuffer(buf) ? sniff(buf) : null;
  if (!found || !ALLOWED[doc.kind].includes(found.type)) return res.status(415).json({ error: "Unsupported file type." });
  const old = doc.storageKey;
  const storageKey = `${old.split("/").slice(0, 2).join("/")}/${randomToken(14)}.${found.ext}`; // new key defeats browser/CDN caches
  await storage().put(storageKey, buf, found.type);
  doc.set({ storageKey, url: `/media/${storageKey}`, mimeType: found.type, sizeBytes: buf.length });
  await doc.save(); await storage().delete(old);
  await audit(req, "media.replace", "media", doc.id, doc.filename);
  res.json(doc);
});

const inUse = async (id) => {
  const checks = await Promise.all([
    Project.exists({ $or: [{ cover: id }, { "images.media": id }] }), Post.exists({ cover: id }), Service.exists({ image: id }),
    Certification.exists({ file: id }), Testimonial.exists({ avatar: id }), GalleryImage.exists({ media: id }),
  ]);
  return checks.some(Boolean);
};
mediaRouter.delete("/:id", async (req, res) => {
  const doc = await Media.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found." });
  if (await inUse(doc._id)) return res.status(409).json({ error: "This file is used by existing content. Replace or remove it there first." });
  await storage().delete(doc.storageKey); await doc.deleteOne();
  await audit(req, "media.delete", "media", doc.id, doc.filename);
  res.json({ ok: true });
});

// list / get / alt-text edit / bulk come from the shared router (POST "/" and DELETE above take precedence).
mediaRouter.use(crud({ Model: Media, entity: "media", schema: z.object({ altText: z.string().max(200).optional() }), search: ["filename", "altText"], filters: ["kind"], sort: { createdAt: -1 } }));

/** Public file serving with long-lived caching (keys are random and never reused). */
export async function serveMedia(req, res) {
  const key = req.params[0];
  if (!key || key.includes("..")) return res.status(400).end();
  const obj = await storage().get(key);
  if (!obj) return res.status(404).end();
  const ext = key.split(".").pop(), types = { png: "image/png", jpg: "image/jpeg", gif: "image/gif", webp: "image/webp", pdf: "application/pdf" };
  res.set({ "Content-Type": obj.type || types[ext] || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" });
  res.send(obj.body);
}
