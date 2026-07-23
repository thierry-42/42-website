import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://*.hsforms.com",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://*.hsforms.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.hubspot.com https://*.hsforms.com https://*.hsforms.net https://*.hsappstatic.net",
  "font-src 'self' data:",
  `connect-src 'self'${process.env.NODE_ENV === "development" ? " ws: wss:" : ""} https://*.hubspot.com https://*.hsforms.com https://*.hsforms.net https://*.hsappstatic.net`,
  "frame-src https://*.hubspot.com https://*.hsforms.com https://*.hsforms.net",
].join("; ");

const nextConfig: NextConfig = {
  compress: true,
  async headers() {
    return [
      {
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
        source: "/:path*",
      },
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
