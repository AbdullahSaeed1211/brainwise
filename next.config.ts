import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"],
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.clerk.com *.clerk.dev *.hf.space *.brainwise.pro clerk.brainwise.pro https://gradio.s3-us-west-2.amazonaws.com",
              "style-src 'self' 'unsafe-inline' *.hf.space *.clerk.com *.clerk.dev",
              "img-src 'self' data: blob: *.clerk.com *.clerk.dev *.hf.space",
              "font-src 'self' *.hf.space *.clerk.com *.clerk.dev",
              "connect-src 'self' *.clerk.com *.clerk.dev *.hf.space *.brainwise.pro wss:",
              "frame-src 'self' *.hf.space *.gradio.live",
              "media-src 'self' *.hf.space",
              "object-src 'none'",
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
