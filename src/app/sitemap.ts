import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coxsbazarfullmoon.com";
  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-11-08"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

