/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './utils/router';
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DashboardApp } from './components/DashboardApp';

function AppContent() {
  const { routeState, navigate } = useRouter();

  // If viewing the private personal routine dashboard
  if (routeState.route === 'app') {
    return <DashboardApp onBackToPublicSite={() => navigate('/')} />;
  }

  // Public-facing website pages
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-[#D5E8DC] selection:text-[#285737]">
      <PublicNavbar />

      <main className="flex-1">
        {routeState.route === 'home' && <HomePage />}
        {routeState.route === 'about' && <AboutPage />}
        {routeState.route === 'resources' && <ResourcesPage />}
        {routeState.route === 'article' && (
          <ArticleDetailPage slug={routeState.slug || ''} />
        )}
        {routeState.route === 'contact' && <ContactPage />}
        {routeState.route === 'privacy' && <PrivacyPage />}
        {routeState.route === 'terms' && <TermsPage />}
      </main>

      <PublicFooter />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
