# Portfolio — MERN on Cloudflare

```
server/   Express + Mongoose + Zod API   (also the Cloudflare Worker entry: src/worker.js)
client/   Vite + React + Framer Motion   (public site + /admin panel)
```

## Status — read this first
Written and syntax/type-scanned, but **never executed**: the build sandbox had no network, so nothing was `npm install`ed,
built, or run against MongoDB or Cloudflare. Expect to fix a few small things on the first run. Verified: server files parse,
crypto tests pass, client TSX has no syntax errors. Not verified: everything at runtime, Express-on-Workers, the Durable Object
Mongo connection, R2/KV bindings, responsive layout, animations.

## Run locally (MongoDB Compass / local mongod)
```bash
# terminal 1 — API
cd server && npm install && cp .env.example .env     # MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
npm run seed        # loads your existing content (only fills EMPTY collections; never touches admins)
npm run dev         # http://localhost:4000/api/health

# terminal 2 — site
cd client && npm install && npm run dev               # http://localhost:5173  (admin: /admin)
```
Open `/admin` → first visit shows "Create the admin account" (works once, only while no admin exists).
Uploads go to `server/uploads/` locally and to R2 on Cloudflare.

## Deploy to Cloudflare (one Worker: React assets + API)
1. MongoDB Atlas: create a cluster/user, allow network access (Workers use many IPs → allow 0.0.0.0/0 and rely on a strong DB password), copy the connection string.
2. `cd server && npx wrangler login`
3. `npx wrangler r2 bucket create portfolio-media` and `npx wrangler kv namespace create RATE_LIMIT` → paste the KV id into `wrangler.jsonc`.
4. Edit `wrangler.jsonc`: `name`, `CLIENT_ORIGIN`, `PUBLIC_URL`.
5. `npx wrangler secret put MONGODB_URI` and `npx wrangler secret put IP_HASH_SECRET` (random 64-char string).
6. `cd ../client && npm run build && cd ../server && npx wrangler dev` (test locally), then `npx wrangler deploy`.
7. Run the seed once against Atlas: `MONGODB_URI="<atlas uri>" node scripts/seed.js`.

If Express misbehaves on Workers, the fallback is porting `src/routes/*` to Hono (same middleware/route shape).

## What's implemented
- Public: all original sections (data now from the API), Nepal layer (flag with moon/sun, Himalaya parallax, prayer flags,
  Newari divider, loader, page transitions), testimonials / achievements / gallery sections (hidden when empty), blog list + post
  pages, project pages, per-page SEO tags, JSON-LD, sitemap.xml, robots.txt, reduced-motion + admin animation switch.
- Admin: dashboard (real counts + charts), full CRUD with search/filter/pagination/bulk/drag-reorder/confirm/validation errors/
  autosaved drafts/preview for projects, skills (+categories), services, experience, education, certifications, achievements,
  testimonials, blog (+categories, rich text, scheduling), gallery (+albums); enquiry inbox; media library (upload, replace,
  alt text, delete-protection); website settings (profile, hero, about, social, stats, section visibility, brand colours,
  animation, footer, SEO); activity log; password change + session management.
- Security: PBKDF2, hashed session tokens, httpOnly cookie, CSRF token + Origin check, rate limits (memory / KV), zod validation,
  HTML sanitising, magic-byte upload validation (SVG refused), audit log.

## Design system (red / gold / ivory / maroon)
Tokens live at the top of `client/src/index.css` (`--color-nepal-red`, `--gold`, `--maroon`, …) and in `client/src/admin/admin.css`.
Light (ivory) is the default theme; the nav, hero and footer are always dark maroon. The legacy `--blue` variable now holds the gold accent.
Admin → Website settings → Brand: change crimson/gold. Hero background photo, profile photo and gallery photos are uploaded in the admin.
The hero uses an illustrated vector Himalaya/pagoda/stupa scene (no photographs are bundled); upload a photo in Hero settings to replace it.

## Known gaps
- Nepal flag proportions are approximate; compare against the official construction sheet before publishing.
- Rich-text editor uses the browser's `execCommand` (works, but basic). Swap for TipTap later if you want more.
- Crawlers that don't run JavaScript only see default meta tags (Google does run it). Server-side meta injection is a later step.
- Admin "dashboard customization" (rearranging widgets) and a navigation editor are not built.
- No automated API tests beyond the crypto unit tests; no mobile/visual testing was possible.
