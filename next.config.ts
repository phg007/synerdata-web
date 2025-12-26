import type { NextConfig } from "next";
import { resolve } from "path";

// =============================================================================
// SECURITY HEADERS (desativado temporariamente)
// Para ativar: descomente o bloco abaixo e adicione os domínios de tráfego pago
// Exemplo: Google Analytics, Facebook Pixel, etc.
// =============================================================================
// const securityHeaders = [
//   {
//     key: "X-DNS-Prefetch-Control",
//     value: "on",
//   },
//   {
//     key: "Strict-Transport-Security",
//     value: "max-age=63072000; includeSubDomains; preload",
//   },
//   {
//     key: "X-Frame-Options",
//     value: "SAMEORIGIN",
//   },
//   {
//     key: "X-Content-Type-Options",
//     value: "nosniff",
//   },
//   {
//     key: "X-XSS-Protection",
//     value: "1; mode=block",
//   },
//   {
//     key: "Referrer-Policy",
//     value: "strict-origin-when-cross-origin",
//   },
//   {
//     key: "Permissions-Policy",
//     value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
//   },
//   {
//     key: "Content-Security-Policy",
//     value: [
//       "default-src 'self'",
//       "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
//       // Adicione domínios de tráfego pago aqui:
//       // "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.facebook.net",
//       "style-src 'self' 'unsafe-inline'",
//       "img-src 'self' data: blob: https:",
//       "font-src 'self' data:",
//       "connect-src 'self' https://viacep.com.br https://*.uploadthing.com https://*.synnerdata.com.br",
//       // Adicione domínios de analytics aqui:
//       // "connect-src 'self' ... https://*.google-analytics.com https://*.facebook.com",
//       "frame-ancestors 'self'",
//       "form-action 'self'",
//       "base-uri 'self'",
//       "upgrade-insecure-requests",
//     ].join("; "),
//   },
// ];

const nextConfig: NextConfig = {
  output: "standalone",
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": resolve(__dirname, "src"),
    };
    return config;
  },
  // Para ativar security headers, descomente:
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: securityHeaders,
  //     },
  //   ];
  // },
};

export default nextConfig;
