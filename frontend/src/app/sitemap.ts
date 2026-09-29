import type { MetadataRoute } from "next";

const routes = ["", "/about", "/architecture", "/contact", "/experience", "/lab", "/projects", "/recruiter", "/skills"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) return [];
  const lastModified = new Date();
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : .7,
  }));
}
