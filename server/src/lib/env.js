export const env = () => ({
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio",
  port: Number(process.env.PORT || 4000),
  isProd: process.env.NODE_ENV === "production",
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim()).filter(Boolean),
  ipHashSecret: process.env.IP_HASH_SECRET || "dev-only-secret",
});
