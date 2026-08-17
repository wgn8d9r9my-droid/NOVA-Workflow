import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NOVA — Ton espace numérique personnel",
    short_name: "NOVA",
    description:
      "Life OS personnel : projets, objectifs, finances, habitudes et créativité, réunis dans un seul espace.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0d10",
    theme_color: "#104090",
    icons: [
      { src: "/nova-logo.png", sizes: "1254x1254", type: "image/png", purpose: "any" },
      { src: "/nova-logo.png", sizes: "1254x1254", type: "image/png", purpose: "maskable" },
    ],
  };
}
