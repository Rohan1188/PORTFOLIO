import { AdminUser, Session, Activity } from "../models/index.js";
import { randomToken, sha256Hex, timingSafeEqual } from "../lib/crypto.js";
import { env } from "../lib/env.js";

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const cookieName = () => (env().isProd ? "__Host-rk_session" : "rk_session"); // __Host- needs HTTPS: production only
export const cookieOpts = () => ({ httpOnly: true, secure: env().isProd, sameSite: "lax", path: "/", maxAge: SESSION_TTL_MS });

export async function createSession(userId, userAgent = "") {
  const token = randomToken(32), csrfToken = randomToken(24);
  await Session.create({ _id: await sha256Hex(token), userId, csrfToken, expiresAt: new Date(Date.now() + SESSION_TTL_MS), userAgent: userAgent.slice(0, 200) });
  return { token, csrfToken };
}

export async function authenticate(token) {
  if (!token || token.length > 128) return null;
  const id = await sha256Hex(token);
  const s = await Session.findById(id);
  if (!s || s.expiresAt <= new Date()) return null;
  const user = await AdminUser.findById(s.userId).select("email");
  if (!user) return null;
  if (s.expiresAt.getTime() - Date.now() < SESSION_TTL_MS / 2) { s.expiresAt = new Date(Date.now() + SESSION_TTL_MS); } // sliding expiry
  s.lastSeenAt = new Date(); await s.save();
  return { sessionId: id, userId: user.id, email: user.email, csrfToken: s.csrfToken };
}

/** Requires a valid session for every admin route. */
export async function requireAdmin(req, res, next) {
  try {
    const auth = await authenticate(req.cookies?.[cookieName()]);
    if (!auth) return res.status(401).json({ error: "Not signed in." });
    req.admin = auth; next();
  } catch (e) { next(e); }
}

/** CSRF: unsafe methods need the per-session token header AND an allowed Origin (when the browser sends one). */
export function requireCsrf(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const given = String(req.get("x-csrf-token") || "");
  const a = new TextEncoder().encode(req.admin.csrfToken), b = new TextEncoder().encode(given);
  if (!given || !timingSafeEqual(a, b)) return res.status(403).json({ error: "Invalid CSRF token." });
  const origin = req.get("origin");
  if (origin && !env().clientOrigins.includes(origin)) return res.status(403).json({ error: "Origin not allowed." });
  next();
}

export const audit = (req, action, entity, entityId, detail) =>
  Activity.create({ userId: req.admin?.userId, action, entity, entityId: entityId ? String(entityId) : undefined, detail: detail?.slice?.(0, 300) }).catch(() => {});
