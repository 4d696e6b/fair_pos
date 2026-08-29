import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
=======
  /* config options here */
  reactCompiler: true,
  output: "standalone",
>>>>>>> 7f14b31 (chore: initial docker)
};

export default nextConfig;
