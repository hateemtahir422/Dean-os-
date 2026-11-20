/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SecurityHeaderOptions {
  /** Development mode allows Vite HMR inline scripts/WebSockets and AI Studio iframe embedding */
  isDev?: boolean;
  /** Enables upgrade-insecure-requests when served over HTTPS */
  enforceHttps?: boolean;
}

export const REFERRER_POLICY = 'strict-origin-when-cross-origin';

export const PERMISSIONS_POLICY =
  'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()';

/**
 * Builds a Content-Security-Policy compatible with:
 * - React SPA scripts & Tailwind CSS
 * - Inline progress bar width styles (style-src 'unsafe-inline')
 * - Web Audio API synthesized chimes (AudioContext, no external media)
 * - Browser Notification API (icon: /favicon.ico)
 * - JSON backup Blob downloads & FileReader imports
 * - canvas-confetti Web Worker (worker-src 'self' blob:)
 * - Contact page mailto: links (form-action 'self' mailto:)
 */
export function buildContentSecurityPolicy(options: SecurityHeaderOptions = {}): string {
  const { isDev = false, enforceHttps = false } = options;

  const directives = [
    "default-src 'self'",
    isDev ? "script-src 'self' 'unsafe-inline'" : "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "media-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' mailto:",
  ];

  // Dev server runs inside an iframe in AI Studio preview; enforce frame-ancestors 'none' in production/preview.
  if (!isDev) {
    directives.push("frame-ancestors 'none'");
  }

  if (enforceHttps) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

/**
 * Returns HTTP security headers for static production hosting, Vite preview, or local Vite dev.
 */
export function getSecurityHeaders(options: SecurityHeaderOptions = {}): Record<string, string> {
  const { isDev = false, enforceHttps = false } = options;

  const headers: Record<string, string> = {
    'Content-Security-Policy': buildContentSecurityPolicy({ isDev, enforceHttps }),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': REFERRER_POLICY,
    'Permissions-Policy': PERMISSIONS_POLICY,
  };

  if (!isDev) {
    headers['X-Frame-Options'] = 'DENY';
  }

  if (enforceHttps) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }

  return headers;
}
