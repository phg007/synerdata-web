import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
