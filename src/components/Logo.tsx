import Image from "next/image";
import type { Brand } from "@/lib/brand";

/**
 * Renders the OFFICIAL Codistack logo only.
 * - Dark-background variant if supplied (transparent, light wordmark).
 * - Otherwise the original artwork on a deliberately designed light glass surface.
 * - If no artwork has been supplied, a neutral text label is shown (no invented symbol).
 */
export function Logo({
  brand,
  height = 36,
  className = "",
  priority = false,
}: {
  brand: Brand;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const asset = brand.logoDark ?? brand.logoOriginal;

  if (!asset) {
    return (
      <span
        className={`inline-flex items-center font-display font-bold tracking-[0.22em] text-white ${className}`}
        style={{ fontSize: height * 0.5 }}
        data-logo-missing="true"
      >
        CODISTACK
      </span>
    );
  }

  const width = Math.round((asset.width / asset.height) * height);
  const img = (
    <Image
      src={asset.src}
      alt="Codistack"
      width={width}
      height={height}
      priority={priority}
      style={{ height, width: "auto" }}
    />
  );

  if (brand.logoDark) return <span className={`inline-flex ${className}`}>{img}</span>;

  return (
    <span
      className={`inline-flex items-center rounded-xl bg-soft px-3 py-1.5 shadow-[0_0_0_1px_rgba(135,216,255,0.5),0_8px_24px_-8px_rgba(21,159,255,0.6)] ${className}`}
    >
      {img}
    </span>
  );
}
