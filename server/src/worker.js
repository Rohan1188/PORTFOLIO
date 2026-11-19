// Cloudflare entry point. One Worker serves the React build (static assets) and the Express API.
// The API runs inside a Durable Object so the MongoDB connection can stay open between requests
// (a plain Worker cannot reuse I/O objects across requests). Pattern follows Cloudflare's MongoDB + Mongoose guidance.
import { DurableObject } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import { createApp } from "./app.js";
import { setStorage, r2Driver } from "./lib/storage.js";
import { setRateStore, kvStore } from "./middleware/rateLimit.js";

const PORT = 8080;

export class ApiDO extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    // Secrets/vars become process.env under nodejs_compat (MONGODB_URI, IP_HASH_SECRET, CLIENT_ORIGIN, ...).
    for (const [k, v] of Object.entries(env)) if (typeof v === "string") process.env[k] ??= v;
    process.env.NODE_ENV ||= "production";
    setStorage(r2Driver(env.MEDIA));
    if (env.RATE_LIMIT) setRateStore(kvStore(env.RATE_LIMIT));
    createApp().listen(PORT);
    this.handler = httpServerHandler({ port: PORT });
  }
  fetch(request) { return this.handler.fetch(request, this.env, this.ctx); }
}

const API_PATHS = [/^\/api\//, /^\/media\//, /^\/sitemap\.xml$/, /^\/robots\.txt$/];

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (API_PATHS.some((re) => re.test(pathname))) {
      return env.API_DO.get(env.API_DO.idFromName("api")).fetch(request);
    }
    return env.ASSETS.fetch(request); // React app (SPA fallback is handled by the assets config)
  },
};
