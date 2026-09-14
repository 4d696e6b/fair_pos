import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

// Docker/local production images use standalone. Vercel sets VERCEL=1 and
// should use the default Next.js output so routing and assets work.
if (!process.env.VERCEL) {
  nextConfig.output = "standalone";
}

export default nextConfig;
