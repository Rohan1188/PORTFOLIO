// Upload validation: trust the file's real bytes, never the filename or Content-Type header. SVG is refused (script risk).
const SIGS = [
  { type: "image/png", ext: "png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { type: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/gif", ext: "gif", test: (b) => b.toString("latin1", 0, 4) === "GIF8" },
  { type: "image/webp", ext: "webp", test: (b) => b.toString("latin1", 0, 4) === "RIFF" && b.toString("latin1", 8, 12) === "WEBP" },
  { type: "application/pdf", ext: "pdf", test: (b) => b.toString("latin1", 0, 5) === "%PDF-" },
];
export const ALLOWED = { image: ["image/png", "image/jpeg", "image/gif", "image/webp"], resume: ["application/pdf"], certificate: ["application/pdf", "image/png", "image/jpeg", "image/webp"], file: ["application/pdf"] };
export const MAX_BYTES = 8 * 1024 * 1024;

export function sniff(buf) { return SIGS.find((s) => buf.length > 12 && s.test(buf)) ?? null; }
export const safeName = (n) => String(n || "file").replace(/[^\w.\- ]+/g, "_").slice(0, 120);
