// Object storage behind one interface: local disk for development, Cloudflare R2 in production.
let impl;

export const localStorageDriver = (dir = "./uploads") => ({
  async put(key, buf) {
    const fs = await import("node:fs/promises"), path = await import("node:path");
    const file = path.join(dir, key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, buf);
  },
  async get(key, ext) {
    const fs = await import("node:fs/promises"), path = await import("node:path");
    const file = path.resolve(dir, key);
    if (!file.startsWith(path.resolve(dir) + path.sep)) return null; // no path traversal
    try { return { body: await fs.readFile(file) }; } catch { return null; }
  },
  async delete(key) {
    const fs = await import("node:fs/promises"), path = await import("node:path");
    const file = path.resolve(dir, key);
    if (file.startsWith(path.resolve(dir) + path.sep)) await fs.rm(file, { force: true });
  },
});

export const r2Driver = (bucket) => ({
  async put(key, buf, type) { await bucket.put(key, buf, { httpMetadata: { contentType: type } }); },
  async get(key) {
    const o = await bucket.get(key);
    return o ? { body: Buffer.from(await o.arrayBuffer()), type: o.httpMetadata?.contentType } : null;
  },
  async delete(key) { await bucket.delete(key); },
});

export const setStorage = (s) => { impl = s; };
export const storage = () => (impl ??= localStorageDriver(process.env.UPLOAD_DIR || "./uploads"));
