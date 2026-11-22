#!/usr/bin/env node
// Usage: node scripts/hash-password.mjs "your-strong-password"
// Prints a value for ADMIN_PASSWORD_HASH. Never commit the password itself.
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Provide a password of at least 12 characters:\n  node scripts/hash-password.mjs "your-strong-password"');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`scrypt$${salt.toString("hex")}$${hash.toString("hex")}`);
console.log("\nAlso set APP_SECRET to a random 32+ character string, e.g.:");
console.log(`  ${randomBytes(32).toString("hex")}`);
