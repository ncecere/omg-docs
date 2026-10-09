import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // A static export, served by nginx (see Dockerfile and nginx/default.conf).
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // No image optimisation server in a static export; screenshots are optimised
    // ahead of time by scripts/import-screenshots.mjs.
    unoptimized: true,
  },
  // The docs never call home: no Next.js telemetry in the browser either.
  productionBrowserSourceMaps: false,
};

export default withMDX(config);
