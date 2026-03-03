/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@f2k/shared", "@f2k/db"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
    };
    return config;
  },
};

module.exports = nextConfig;
