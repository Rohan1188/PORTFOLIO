import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import { env } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { publicRouter } from "./routes/public.js";
import { serveMedia } from "./routes/media.js";
import { seoRouter } from "./routes/seo.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", true);
  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: env().clientOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get(/^\/media\/(.+)$/, serveMedia);
  app.use(seoRouter);
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", async (_req, _res, next) => { try { await connectDb(); next(); } catch (e) { next(e); } });
  app.use("/api/public", publicRouter);
  app.use("/api/admin/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

  // Safe error handling: validation errors are explained; everything else is generic (details stay in server logs).
  app.use((err, _req, res, _next) => {
    if (err instanceof ZodError) {
      const fields = {};
      for (const i of err.issues) fields[i.path.join(".") || "_"] = i.message;
      return res.status(400).json({ error: "Please fix the highlighted fields.", fields });
    }
    if (err?.name === "CastError") return res.status(400).json({ error: "Invalid id." });
    if (err?.code === 11000) return res.status(409).json({ error: "That value already exists." });
    if (err?.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON." });
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  });
  return app;
}
