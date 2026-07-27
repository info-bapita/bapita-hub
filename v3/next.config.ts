import type { NextConfig } from "next";
import path from "path";

/**
 * The repo is a multi-package workspace (v1/, v2/, v3/), so Next infers a root
 * above this app and warns. Both roots are pinned to this directory, and both
 * on purpose: setting only `turbopack.root` left `outputFileTracingRoot` unset,
 * which Vercel then fills with the build root, and the two disagreeing is what
 * the build warning was about.
 */
const appRoot = path.resolve(import.meta.dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
};

export default nextConfig;
