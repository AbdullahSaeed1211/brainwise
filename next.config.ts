import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.com *.clerk.dev *.clerk.accounts.dev *.hf.space *.brainwise.pro clerk.brainwise.pro",
              "style-src 'self' 'unsafe-inline' *.hf.space *.clerk.com *.clerk.dev *.clerk.accounts.dev",
              "img-src 'self' data: blob: *.clerk.com *.clerk.dev *.clerk.accounts.dev *.hf.space",
              "font-src 'self' *.hf.space *.clerk.com *.clerk.dev *.clerk.accounts.dev",
              "connect-src 'self' *.clerk.com *.clerk.dev *.clerk.accounts.dev *.hf.space *.brainwise.pro api.semanticscholar.org clerk-telemetry.com wss:",
              "worker-src 'self' blob:",
              "frame-src 'self' *.hf.space *.gradio.live",
              "media-src 'self' *.hf.space",
              "object-src 'self' data:",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;
