import type { Metadata } from "next";

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Turn a relative path/asset into an absolute URL, falling back to the default OG image. */
export const abs = (p?: string | null) =>
  !p ? `${SITE}/og-default.svg` : p.startsWith("http") ? p : `${SITE}${p}`;

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path beginning with "/" (used for canonical + og:url). */
  path?: string;
  /** Relative or absolute image URL; defaults to /og-default.svg. */
  image?: string | null;
  type?: "website" | "article";
};

/**
 * Build a complete Metadata object (title, canonical, Open Graph, Twitter card)
 * for a page. The root layout's title template appends " | MyKvadro" to `title`,
 * so pass a bare page title here.
 */
export function pageMetadata({ title, description, path = "/", image, type = "website" }: PageMetaInput): Metadata {
  const url = `${SITE}${path}`;
  const ogTitle = `${title} | MyKvadro`;
  const img = abs(image);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      type,
      siteName: "MyKvadro",
      locale: "ka_GE",
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [img] },
  };
}
