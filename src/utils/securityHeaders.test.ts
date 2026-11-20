import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContentSecurityPolicy,
  getSecurityHeaders,
  PERMISSIONS_POLICY,
  REFERRER_POLICY,
} from './securityHeaders';

test('production security headers include required clickjacking, MIME, referrer, and permissions policies', () => {
  const headers = getSecurityHeaders({ isDev: false, enforceHttps: true });

  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['Referrer-Policy'], REFERRER_POLICY);
  assert.equal(headers['Permissions-Policy'], PERMISSIONS_POLICY);
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.equal(headers['Strict-Transport-Security'], 'max-age=31536000; includeSubDomains');
});

test('production CSP blocks unsafe script execution while supporting React, Web Audio, confetti workers, and backups', () => {
  const csp = buildContentSecurityPolicy({ isDev: false, enforceHttps: true });

  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /script-src 'self'(?! 'unsafe-inline')/);
  assert.ok(!csp.includes("'unsafe-eval'"));
  assert.match(csp, /style-src 'self' 'unsafe-inline'/);
  assert.match(csp, /img-src 'self' data: blob:/);
  assert.match(csp, /worker-src 'self' blob:/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /base-uri 'self'/);
  assert.match(csp, /form-action 'self' mailto:/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /upgrade-insecure-requests/);
});

test('dev security headers keep preview iframe and Vite HMR functional without dropping MIME/referrer protections', () => {
  const headers = getSecurityHeaders({ isDev: true, enforceHttps: false });

  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
  assert.equal(headers['Referrer-Policy'], REFERRER_POLICY);
  assert.equal(headers['Permissions-Policy'], PERMISSIONS_POLICY);
  assert.equal(headers['X-Frame-Options'], undefined);
  assert.equal(headers['Strict-Transport-Security'], undefined);
  assert.ok(!headers['Content-Security-Policy'].includes('frame-ancestors'));
  assert.match(headers['Content-Security-Policy'], /connect-src 'self' ws: wss:/);
});
