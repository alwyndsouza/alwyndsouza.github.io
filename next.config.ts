import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "build",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "",
  // Point to this worktree's root so Next.js doesn't pick up parent lockfiles
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
