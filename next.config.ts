import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "80mb",
    },
    optimizePackageImports: ["@supabase/supabase-js"],
  },
};

export default nextConfig;
