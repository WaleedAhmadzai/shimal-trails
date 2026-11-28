import type { MetadataRoute } from "next";
import { getAllDestinations } from "@/lib/destinations";

const BASE = "https://shimal-trails.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/destinations", "/itinerary", "/plan-trip", "/about"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const destinations = getAllDestinations().map((d) => ({
    url: `${BASE}/destinations/${d.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...destinations];
}
