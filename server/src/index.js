import { createApp } from "./app.js";
import { env } from "./lib/env.js";
import { connectDb } from "./lib/db.js";

await connectDb();
createApp().listen(env().port, () => console.log(`API listening on http://localhost:${env().port}`));
