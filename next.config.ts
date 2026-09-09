import type { NextConfig } from "next";

// GitHub Pages pipeline sets STATIC_EXPORT=1: pure static export to out/
// (the deploy workflow removes src/app/api first — Pages has no server).
// NEXT_PUBLIC_BASE_PATH handles project pages (username.github.io/repo).
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      images: { unoptimized: true },
      basePath: basePath || undefined,
      reactStrictMode: false,
    }
  : {
      output: "standalone",
      reactStrictMode: false,
      // Real hardening headers (ATHA securityvalidator finding: the app set
      // no security headers itself). Static Pages can't set response headers;
      // these apply whenever the site is served by the Node server.
      async headers() {
        return [
          {
            source: "/:path*",
            headers: [
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "X-Frame-Options", value: "SAMEORIGIN" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              {
                key: "Permissions-Policy",
                value: "camera=(), microphone=(), geolocation=(), payment=()",
              },
            ],
          },
        ];
      },
    };

export default nextConfig;
