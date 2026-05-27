import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow the quality values used across the site (next/image defaults to
    // only [75], which warns on the quality={82}/{85} images).
    qualities: [75, 82, 85],
  },
};

export default nextConfig;
