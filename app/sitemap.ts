import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "/", lastModified: new Date() },
    { url: "/privacy", lastModified: new Date() },
    { url: "/terms", lastModified: new Date() }
  ];
}
