import type { MetadataRoute } from "next";
import { getAllAtvIds } from "@/lib/atvs";
import { getAllBlogIds } from "@/lib/blogs";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "", "/find-atvs", "/atv-dealers", "/blog", "/research",
    "/sell-my-atv", "/about", "/contact", "/login", "/signup",
    "/privacy", "/terms",
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  let atvRoutes: MetadataRoute.Sitemap = [];
  try {
    const ids = await getAllAtvIds();
    atvRoutes = ids.map((id) => ({
      url: `${SITE}/atvs/${id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable at build time — static routes still emit.
  }

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const ids = await getAllBlogIds();
    blogRoutes = ids.map((id) => ({
      url: `${SITE}/blog/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time — static routes still emit.
  }

  return [...staticRoutes, ...atvRoutes, ...blogRoutes];
}
