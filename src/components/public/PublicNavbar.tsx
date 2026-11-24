import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link, useRouter } from '../../utils/router';
import { BrandMark } from '../BrandMark';

export const PublicNavbar: React.FC = () => {
  const { routeState } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && routeState.route === 'home') return true;
    if (path === '/about' && routeState.route === 'about') return true;
    if (path === '/resources' && (routeState.route === 'resources' || routeState.route === 'article')) return true;
    if (path === '/contact' && routeState.route === 'contact') return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Resources', to: '/resources' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4D9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <BrandMark size="lg" className="group-hover:scale-105 transition-transform" />
          <div>
            <span className="text-base font-bold text-stone-800 tracking-tight block">
              TechSSP
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#5B7F6B] block -mt-1">
              Personal Growth Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F4EFE6]/70 p-1 rounded-2xl border border-[#E8DEC9]">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-stone-800 shadow-2xs border border-stone-200/80 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button to Existing Dashboard */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/app"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-xs font-semibold shadow-xs transition-all hover:shadow-sm cursor-pointer group"
          >
            <span>Open Routine OS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE1] transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE4D9] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#EBF4EE] text-[#285737] font-bold border border-[#BCDDC7]'
                      : 'text-stone-700 hover:bg-[#F4ECE0]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#EAE4D9]">
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore Your Daily Routine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
