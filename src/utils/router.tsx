import React, { createContext, useContext, useEffect, useState } from 'react';

export type PublicRoute =
  | 'home'
  | 'about'
  | 'resources'
  | 'article'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'app';

export interface RouteState {
  path: string;
  route: PublicRoute;
  slug?: string;
}

export function parsePath(pathname: string): RouteState {
  // Normalize trailing slash
  const clean = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  if (clean === '/app' || clean === '/dashboard') {
    return { path: clean, route: 'app' };
  }
  if (clean === '/about') {
    return { path: clean, route: 'about' };
  }
  if (clean === '/resources') {
    return { path: clean, route: 'resources' };
  }
  if (clean.startsWith('/resources/')) {
    const slug = clean.replace('/resources/', '');
    return { path: clean, route: 'article', slug };
  }
  if (clean === '/contact') {
    return { path: clean, route: 'contact' };
  }
  if (clean === '/privacy') {
    return { path: clean, route: 'privacy' };
  }
  if (clean === '/terms') {
    return { path: clean, route: 'terms' };
  }
  return { path: '/', route: 'home' };
}

export function navigate(to: string) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== to) {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new Event('popstate'));
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function normalizeSiteUrl(rawUrl?: string): string {
  const trimmed = (rawUrl || '').trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(trimmed) ? trimmed : '';
}

export function getSiteOrigin(): string {
  const configured =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.VITE_SITE_URL === 'string'
      ? normalizeSiteUrl(import.meta.env.VITE_SITE_URL)
      : '';
  if (configured) return configured;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

export interface PageMetaOptions {
  isPrivate?: boolean;
  type?: 'website' | 'article';
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
}

export function updatePageMeta(
  title: string,
  description: string,
  optionsOrIsPrivate: boolean | PageMetaOptions = false
) {
  if (typeof document === 'undefined') return;

  const isPrivate =
    typeof optionsOrIsPrivate === 'boolean'
      ? optionsOrIsPrivate
      : !!optionsOrIsPrivate.isPrivate;

  const ogType =
    typeof optionsOrIsPrivate === 'object' && optionsOrIsPrivate.type
      ? optionsOrIsPrivate.type
      : 'website';

  const origin = getSiteOrigin();
  const normalizedPath =
    typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/';

  const canonicalUrl = isPrivate
    ? undefined
    : typeof optionsOrIsPrivate === 'object' && optionsOrIsPrivate.canonicalUrl
    ? optionsOrIsPrivate.canonicalUrl
    : origin
    ? `${origin}${normalizedPath}`
    : undefined;

  const structuredData =
    typeof optionsOrIsPrivate === 'object'
      ? optionsOrIsPrivate.structuredData
      : undefined;

  document.title = title;

  const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:site_name', "Dean's Daily OS");
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);

  // Canonical link & og:url (omitted on private / noindex views)
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  const existingOgUrl = document.querySelector('meta[property="og:url"]');
  if (canonicalUrl) {
    if (existingCanonical) {
      existingCanonical.setAttribute('href', canonicalUrl);
    } else {
      const canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      canonicalEl.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalEl);
    }
    setMetaTag('property', 'og:url', canonicalUrl);
  } else {
    existingCanonical?.remove();
    existingOgUrl?.remove();
  }

  // Structured Data (JSON-LD)
  let scriptSchema = document.getElementById('seo-structured-data');
  if (structuredData && !isPrivate) {
    if (!scriptSchema) {
      scriptSchema = document.createElement('script');
      scriptSchema.id = 'seo-structured-data';
      scriptSchema.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptSchema);
    }
    scriptSchema.textContent = JSON.stringify(structuredData);
  } else if (scriptSchema) {
    scriptSchema.remove();
  }

  // Robots tag (noindex, nofollow, noarchive for private routine dashboard & missing pages)
  setMetaTag(
    'name',
    'robots',
    isPrivate ? 'noindex, nofollow, noarchive' : 'index, follow'
  );
}

interface RouterContextType {
  routeState: RouteState;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  routeState: { path: '/', route: 'home' },
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routeState, setRouteState] = useState<RouteState>(() => {
    if (typeof window === 'undefined') return { path: '/', route: 'home' };
    return parsePath(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parsePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ routeState, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, className, children, onClick, ...rest }) => {
  const { navigate: routerNav } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      routerNav(to);
    }
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
