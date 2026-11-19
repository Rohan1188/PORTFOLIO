import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, randomToken, sha256Hex } from "../src/lib/crypto.js";

test("password hash verifies and rejects wrong password", async () => {
  const h = await hashPassword("correct horse battery staple");
  assert.match(h, /^pbkdf2\$100000\$/);
  assert.equal(await verifyPassword("correct horse battery staple", h), true);
  assert.equal(await verifyPassword("wrong", h), false);
  assert.equal(await verifyPassword("x", "garbage"), false);
});
test("tokens are unique and hashing is stable", async () => {
  assert.notEqual(randomToken(), randomToken());
  assert.equal(await sha256Hex("a"), await sha256Hex("a"));
});
