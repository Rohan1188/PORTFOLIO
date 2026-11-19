// Web Crypto helpers: identical on Node 20+ and Cloudflare Workers.
const enc = new TextEncoder();
export const PBKDF2_ITERATIONS = 100_000; // Workers caps PBKDF2 at 100k; count is stored in the hash so it can be raised later.

const b64 = (buf) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
}

export function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, iterations);
  return `pbkdf2$${iterations}$${b64(salt)}$${b64(hash)}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, iter, salt, hash] = String(stored).split("$");
  if (scheme !== "pbkdf2" || !iter || !salt || !hash) return false;
  const iterations = Number(iter);
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > 1_000_000) return false;
  const derived = await pbkdf2(password, unb64(salt), iterations);
  return timingSafeEqual(new Uint8Array(derived), unb64(hash));
}

export function randomToken(bytes = 32) {
  return b64(crypto.getRandomValues(new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export async function sha256Hex(v) { return toHex(await crypto.subtle.digest("SHA-256", enc.encode(v))); }
export async function hmacHex(secret, v) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(v)));
}
