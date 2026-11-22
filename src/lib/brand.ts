import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Official brand assets. The Codistack logo must be supplied by the brand owner;
 * this site never draws or approximates it. Drop PNG files into `public/brand/`:
 *
 *   codistack-logo.png        original logo artwork (any background)
 *   codistack-logo-dark.png   optional: faithful transparent, light-wordmark variant for dark backgrounds
 *   codistack-symbol.png      optional: the C symbol alone (used for favicon / social icon)
 *
 * Then rebuild. Until then, the UI shows a plain, clearly-neutral text label.
 */

export type BrandAsset = { src: string; width: number; height: number };
export type Brand = {
  logoDark: BrandAsset | null;
  logoOriginal: BrandAsset | null;
  symbol: BrandAsset | null;
};

function readPng(file: string): BrandAsset | null {
  try {
    const full = path.join(process.cwd(), "public", "brand", file);
    if (!fs.existsSync(full)) return null;
    const buf = fs.readFileSync(full);
    // PNG IHDR: width @16, height @20 (big endian)
    if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
    return { src: `/brand/${file}`, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

export function getBrand(): Brand {
  return {
    logoDark: readPng("codistack-logo-dark.png"),
    logoOriginal: readPng("codistack-logo.png"),
    symbol: readPng("codistack-symbol.png"),
  };
}
