import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => { ret.id = String(ret._id); delete ret._id; return ret; },
});
mongoose.set("strictQuery", true);

let connecting;
/** Cached connection. On Workers the same function is called per request; the cache keeps it cheap. */
export function connectDb() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  connecting ??= mongoose.connect(env().mongoUri, { serverSelectionTimeoutMS: 8000 }).catch((e) => { connecting = undefined; throw e; });
  return connecting;
}
