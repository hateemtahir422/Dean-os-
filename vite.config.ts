import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {getSecurityHeaders} from './src/utils/securityHeaders';

function seoDomainPlugin(): Plugin {
  const rawSiteUrl = (process.env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
  const siteUrl = /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : 'https://techssp.com';

  const applyDomainToRobots = (content: string) => {
    const base = content.replace(/^Sitemap:.*$/gm, '').trimEnd();
    return `${base}\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  };

  const applyDomainToSitemap = (content: string) => {
    return content.replace(/<loc>(https?:\/\/[^/]+)?(\/[^<]*)<\/loc>/g, (_m, _orig, routePath) => `<loc>${siteUrl}${routePath}</loc>`);
  };

  return {
    name: 'seo-public-domain',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/robots.txt') {
          const p = path.resolve(__dirname, 'public/robots.txt');
          if (fs.existsSync(p)) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(applyDomainToRobots(fs.readFileSync(p, 'utf8')));
            return;
          }
        }
        if (req.url === '/sitemap.xml') {
          const p = path.resolve(__dirname, 'public/sitemap.xml');
          if (fs.existsSync(p)) {
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.end(applyDomainToSitemap(fs.readFileSync(p, 'utf8')));
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      if (!siteUrl) return;
      const distDir = path.resolve(__dirname, 'dist');
      const robotsPath = path.join(distDir, 'robots.txt');
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      if (fs.existsSync(robotsPath)) {
        fs.writeFileSync(robotsPath, applyDomainToRobots(fs.readFileSync(robotsPath, 'utf8')));
      }
      if (fs.existsSync(sitemapPath)) {
        fs.writeFileSync(sitemapPath, applyDomainToSitemap(fs.readFileSync(sitemapPath, 'utf8')));
      }
    },
  };
}

function securityHeadersPlugin(): Plugin {
  const devHeaders = getSecurityHeaders({isDev: true, enforceHttps: false});
  const previewHeaders = getSecurityHeaders({isDev: false, enforceHttps: false});

  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        for (const [name, value] of Object.entries(devHeaders)) {
          res.setHeader(name, value);
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        for (const [name, value] of Object.entries(previewHeaders)) {
          res.setHeader(name, value);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoDomainPlugin(), securityHeadersPlugin()],
    build: {
      sourcemap: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
