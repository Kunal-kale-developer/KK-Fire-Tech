/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Points Turbopack to the absolute path of the parent monorepo/workspace root
    root: path.join(__dirname, '..'),
  },
};

module.exports = nextConfig;
