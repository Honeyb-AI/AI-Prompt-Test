import type { NextConfig } from "next";

const repoBase = "/AI-Prompt-Test";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? repoBase : undefined,
  assetPrefix: process.env.GITHUB_PAGES === "true" ? repoBase : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
