import type { NextConfig } from "next";
import path from "path";

/**
 * The repo is a multi-package workspace (v1/, v2/, v3/), so Next infers a root
 * above this app and warns locally. Pinning `turbopack.root` silences that.
 *
 * On Vercel the platform sets `outputFileTracingRoot` itself, and pinning
 * either root from here makes the two disagree: setting only `turbopack.root`
 * produced a build warning, and setting both broke the build outright
 * (ENOENT on .next/package.json, deployment dpl_D4XAJz9Q). So on Vercel this
 * config stays out of the way entirely and lets the platform decide.
 */
const nextConfig: NextConfig = process.env.VERCEL
  ? {}
  : { turbopack: { root: path.resolve(import.meta.dirname) } };

export default nextConfig;
