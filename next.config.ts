import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Makes Cloudflare bindings available in `next dev` (no-op in production builds).
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // Cache Components are off: the app has no "use cache" data, and Next.js warns
  // that they do not run reliably on the Cloudflare Workers runtime (the worker
  // hung on every request in the local preview with them enabled).
  cacheComponents: false,
  images: {
    // The only images are static brand assets; skips the Cloudflare Images binding for now.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
