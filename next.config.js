/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    BASE_URL: process.env,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
