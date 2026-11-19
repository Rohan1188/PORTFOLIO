import { Router } from "express";
import { AdminUser, Session, Activity } from "../models/index.js";
import { hashPassword, verifyPassword, sha256Hex } from "../lib/crypto.js";
import { loginSchema, newPassword } from "../lib/schemas.js";
import { createSession, requireAdmin, requireCsrf, cookieName, cookieOpts, audit } from "../middleware/auth.js";
import { rateLimit } from "../middleware/rateLimit.js";

export const authRouter = Router();
let DUMMY; // verified against when the email is unknown, so timing does not reveal which emails exist

authRouter.get("/status", async (_req, res) => res.json({ needsSetup: (await AdminUser.estimatedDocumentCount()) === 0 }));

// First-admin setup: works only while no admin exists. An existing admin is never reset or overwritten.
authRouter.post("/setup", rateLimit("setup", 5, 900), async (req, res) => {
  if ((await AdminUser.countDocuments()) > 0) return res.status(409).json({ error: "Setup is already complete." });
  const { email, password } = loginSchema.extend({ password: newPassword }).parse(req.body);
  let user;
  try { user = await AdminUser.create({ email, passwordHash: await hashPassword(password) }); }
  catch (e) { if (e.code === 11000) return res.status(409).json({ error: "Setup is already complete." }); throw e; }
  const { token, csrfToken } = await createSession(user.id, req.get("user-agent"));
  res.cookie(cookieName(), token, cookieOpts());
  res.status(201).json({ email: user.email, csrfToken });
});

authRouter.post("/login", rateLimit("login", 10, 900), async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await AdminUser.findOne({ email });
  DUMMY ??= await hashPassword("dummy-password-for-timing");
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY);
  if (!user || !ok) return res.status(401).json({ error: "Invalid email or password." });
  user.lastLoginAt = new Date(); await user.save();
  const { token, csrfToken } = await createSession(user.id, req.get("user-agent"));
  res.cookie(cookieName(), token, cookieOpts());
  await Activity.create({ userId: user.id, action: "auth.login", entity: "session" });
  res.json({ email: user.email, csrfToken });
});

authRouter.get("/session", requireAdmin, (req, res) => res.json({ email: req.admin.email, csrfToken: req.admin.csrfToken }));

authRouter.post("/logout", requireAdmin, requireCsrf, async (req, res) => {
  await Session.deleteOne({ _id: req.admin.sessionId });
  res.clearCookie(cookieName(), { ...cookieOpts(), maxAge: undefined });
  res.json({ ok: true });
});

authRouter.post("/change-password", requireAdmin, requireCsrf, rateLimit("pw", 5, 900), async (req, res) => {
  const { currentPassword, newPassword: np } = req.body ?? {};
  const next = newPassword.parse(np);
  const user = await AdminUser.findById(req.admin.userId);
  if (!user || !(await verifyPassword(String(currentPassword ?? ""), user.passwordHash))) return res.status(401).json({ error: "Current password is incorrect." });
  user.passwordHash = await hashPassword(next); await user.save();
  await Session.deleteMany({ userId: user.id, _id: { $ne: req.admin.sessionId } }); // sign out every other device
  await audit(req, "auth.change_password", "admin", user.id);
  res.json({ ok: true });
});

authRouter.get("/sessions", requireAdmin, async (req, res) => {
  const rows = await Session.find({ userId: req.admin.userId }).sort({ lastSeenAt: -1 }).lean();
  res.json(rows.map((s) => ({ id: s._id, userAgent: s.userAgent, lastSeenAt: s.lastSeenAt, createdAt: s.createdAt, current: s._id === req.admin.sessionId })));
});

authRouter.delete("/sessions/:id", requireAdmin, requireCsrf, async (req, res) => {
  await Session.deleteOne({ _id: String(req.params.id).slice(0, 128), userId: req.admin.userId });
  res.json({ ok: true });
});
