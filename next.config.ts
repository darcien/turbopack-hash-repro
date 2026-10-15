import type { NextConfig } from "next";

// `npm run build` / `npm run dev`: the loader rule is on (fails).
// `npm run build:control` / `npm run dev:control`: the loader rule is off (passes).
const withLoader = !process.env.npm_lifecycle_event?.endsWith(":control");

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  turbopack: withLoader
    ? {
        rules: {
          "*.js": {
            // No-op loader on the es5-ext files. Some are in folders named `#`.
            condition: { path: /es5-ext/ },
            loaders: [require.resolve("./noop-loader.js")],
          },
        },
      }
    : {},
};

export default nextConfig;
