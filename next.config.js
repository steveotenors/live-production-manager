/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Removed logging property as it's no longer supported
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    return config;
  }
}

module.exports = nextConfig