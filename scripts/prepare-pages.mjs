import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// 1. Copy public assets (brand images, etc.)
if (fs.existsSync("public")) {
  fs.cpSync("public", dist, { recursive: true });
}

// 2. Copy Next.js static assets (_next/static)
if (fs.existsSync(".next/static")) {
  fs.mkdirSync(path.join(dist, "_next"), { recursive: true });
  fs.cpSync(".next/static", path.join(dist, "_next", "static"), { recursive: true });
}

// 3. Copy prerendered HTML pages
const appDir = path.resolve(".next/server/app");

if (fs.existsSync(path.join(appDir, "index.html"))) {
  fs.copyFileSync(path.join(appDir, "index.html"), path.join(dist, "index.html"));
}

for (const page of ["early-access", "privacy", "terms", "admin", "admin/login"]) {
  const htmlFile = path.join(appDir, `${page}.html`);
  if (fs.existsSync(htmlFile)) {
    const pageDir = path.join(dist, page);
    fs.mkdirSync(pageDir, { recursive: true });
    fs.copyFileSync(htmlFile, path.join(pageDir, "index.html"));
    fs.copyFileSync(htmlFile, path.join(dist, `${page}.html`));
  }
}

// 4. Cloudflare Pages 404 page
if (fs.existsSync(path.join(appDir, "_not-found.html"))) {
  fs.copyFileSync(path.join(appDir, "_not-found.html"), path.join(dist, "404.html"));
}

// 5. Cloudflare Pages _headers file for security headers
const headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  Cross-Origin-Opener-Policy: same-origin
`;
fs.writeFileSync(path.join(dist, "_headers"), headersContent, "utf8");

console.log("Successfully prepared Cloudflare Pages distribution in /dist");
