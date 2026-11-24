import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { Link } from '../../utils/router';
import { BrandMark } from '../BrandMark';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#EAE4D9] bg-[#FAF8F5] pt-12 pb-8 text-stone-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer">
              <BrandMark size="md" />
              <span className="text-base font-bold text-stone-800 tracking-tight">
                TechSSP
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-md">
              A calm, distraction-free personal growth platform and routine organizer. Designed to help people organize daily hours, cultivate steady discipline, and overcome unwanted habits through gentle on-device tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Shield className="w-3.5 h-3.5 text-[#4A7C59]" />
              <span>100% on-device local storage • Zero third-party ad tracking</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Explore
            </h2>
            <ul className="space-y-0.5 sm:space-y-2 text-sm sm:text-xs font-medium">
              <li>
                <Link to="/" className="inline-flex items-center py-1.5 sm:py-0 hover:text-stone-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-flex items-center py-1.5 sm:py-0 hover:text-stone-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/resources" className="inline-flex items-center py-1.5 sm:py-0 hover:text-stone-900 transition-colors">
                  Personal Growth Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-flex items-center py-1.5 sm:py-0 hover:text-stone-900 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Routine Tool & Legal */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Platform & Legal
            </h2>
            <ul className="space-y-0.5 sm:space-y-2 text-sm sm:text-xs font-medium">
              <li>
                <Link to="/app" className="text-[#3D684A] font-semibold hover:underline inline-flex items-center gap-1 py-1.5 sm:py-0">
                  Launch Routine Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="inline-flex items-center py-1.5 sm:py-0 hover:text-stone-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="inline-flex items-center py-1.5 sm:py-0 hover:text-stone-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2 text-stone-400 text-xs sm:text-[11px] break-all">
                Inquiries: hateemtahir4@gmail.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#EAE4D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} TechSSP. Built for mindful, steady daily consistency.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-[11px]">
            <Link to="/privacy" className="py-1.5 sm:py-0 px-1 hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="py-1.5 sm:py-0 px-1 hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link to="/contact" className="py-1.5 sm:py-0 px-1 hover:underline">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
