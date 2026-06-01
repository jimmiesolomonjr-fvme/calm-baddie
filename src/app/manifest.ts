import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Calm Baddie",
    short_name: "Calm Baddie",
    description: "A relaxing coloring book app for baddies",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF0F5",
    theme_color: "#F472B6",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
