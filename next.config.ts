import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "s4.anilist.co" },
      { hostname: "img.anili.st" },
      { hostname: "media.kitsu.app" },
      { hostname: "cdn.myanimelist.net" },
      { hostname: "artworks.thetvdb.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
};

export default nextConfig;
