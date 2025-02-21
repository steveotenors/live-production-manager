import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    // Copy PDF.js worker to public directory
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: "asset/resource",
      generator: {
        filename: "static/worker/[hash][ext][query]",
      },
    });
    
    return config;
  },
};

export default nextConfig;
