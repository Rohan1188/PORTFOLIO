// Fixed-window limiter behind a tiny store interface.
// Node/local: in-memory. On Cloudflare Workers, swap `store` for a KV-backed one (get/put with expirationTtl >= 60).
const memory = new Map();
const memoryStore = {
  async incr(key, windowSec) {
    const now = Date.now();
    for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
    const e = memory.get(key) ?? { count: 0, resetAt: now + windowSec * 1000 };
    e.count += 1; memory.set(key, e);
    return { count: e.count, retryAfter: Math.ceil((e.resetAt - now) / 1000) };
  },
};
let impl = memoryStore;
export const setRateStore = (s) => { impl = s; };
/** KV-backed store for Cloudflare. KV is eventually consistent, so limits are approximate. */
export const kvStore = (kv) => ({
  async incr(key, windowSec) {
    const window = Math.floor(Date.now() / (windowSec * 1000));
    const k = `rl:${key}:${window}`;
    const count = Number((await kv.get(k)) ?? 0) + 1;
    const retryAfter = windowSec - (Math.floor(Date.now() / 1000) % windowSec);
    await kv.put(k, String(count), { expirationTtl: Math.max(60, retryAfter) }); // KV minimum TTL is 60s
    return { count, retryAfter };
  },
});
export const clientIp = (req) => req.headers["cf-connecting-ip"] || req.ip || "unknown";

export const rateLimit = (scope, limit, windowSec) => async (req, res, next) => {
  try {
    const { count, retryAfter } = await impl.incr(`${scope}:${clientIp(req)}`, windowSec);
    if (count > limit) { res.set("Retry-After", String(retryAfter)); return res.status(429).json({ error: "Too many requests. Please try again shortly." }); }
    next();
  } catch (e) { next(e); }
};
export const __reset = () => memory.clear();
