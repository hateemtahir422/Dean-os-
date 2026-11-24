import React, { useEffect } from 'react';
import { Scale, CheckCircle2, AlertCircle, FileText, ShieldCheck, HeartPulse } from 'lucide-react';
import { Link, updatePageMeta } from '../utils/router';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    updatePageMeta(
      "Terms of Service – Usage Guidelines | TechSSP",
      "Read the TechSSP Terms of Service covering personal productivity usage, wellness disclaimers, and local browser data ownership."
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* 1. Header */}
      <div className="space-y-3 border-b border-[#EAE4D9] pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#285737] text-xs font-semibold border border-[#BCDDC7]">
          <Scale className="w-3.5 h-3.5" />
          <span>Usage Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-stone-500">
          Last updated: November 24, 2026
        </p>
      </div>

      {/* 2. Introduction */}
      <p className="text-sm text-stone-700 leading-relaxed font-normal">
        Welcome to TechSSP. By accessing or using our public website, reading our resources, or utilizing the routine dashboard, you agree to these Terms of Service. If you do not agree with these terms, you should discontinue using the platform.
      </p>

      {/* 3. Purpose & Wellness Disclaimer */}
      <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-base sm:text-lg font-bold text-stone-800 flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>1. Purpose and Informational Disclaimer</span>
        </h2>
        <p>
          TechSSP is an open personal productivity tool and self-discipline companion designed to help individuals plan their daily schedule and build steady habits.
        </p>
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC9] text-sm sm:text-xs text-stone-700 space-y-2">
          <p className="font-semibold text-stone-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#935218] shrink-0" />
            Wellness & Medical Notice:
          </p>
          <p className="leading-relaxed">
            The content, habit reflection prompts, and routine suggestions provided by TechSSP are for informational and self-improvement purposes only. They do not constitute medical, psychological, psychiatric, or addiction treatment counseling. If you are struggling with severe physical, clinical, or mental health challenges, please consult a qualified healthcare professional.
          </p>
        </div>
      </section>

      {/* 4. Acceptable Website Usage */}
      <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-base sm:text-lg font-bold text-stone-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>2. Acceptable Website Usage</span>
        </h2>
        <p>
          You agree to use TechSSP only for lawful, personal, and non-commercial productivity purposes. When accessing our services, you agree not to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
          <li>Attempt to disrupt, compromise, or circumvent the operation, security, or integrity of the website or hosting infrastructure.</li>
          <li>Deploy automated scripts, bots, spiders, or scrapers that impose unreasonable load on the servers.</li>
          <li>Transmit malicious code, viruses, trojans, or harmful scripts to the platform.</li>
          <li>Impersonate any person or misrepresent your affiliation with TechSSP.</li>
        </ul>
      </section>

      {/* 5. User Data & On-Device Responsibility */}
      <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-base sm:text-lg font-bold text-stone-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>3. Local Data Responsibility & Intellectual Property</span>
        </h2>
        <p>
          <strong>Your Data:</strong> Because all checklist items, notes, and habit records are stored purely on your local device, you maintain 100% ownership over your personal data. TechSSP cannot access, alter, or recover your local records if you clear your browser cache or reset your device. We encourage you to download periodic JSON backups via Settings.
        </p>
        <p>
          <strong>Platform Intellectual Property:</strong> All original articles, guides, site layouts, graphics, branding, and code provided on the public website are owned by TechSSP and protected by applicable copyright laws. You may read, print, and share links to our public articles for personal, non-commercial use.
        </p>
      </section>

      {/* 6. Disclaimer of Warranties */}
      <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-base sm:text-lg font-bold text-stone-800">
          4. Disclaimer of Warranties and Limitation of Liability
        </h2>
        <p>
          TechSSP is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
        </p>
        <p>
          To the maximum extent permitted by applicable law, TechSSP and its creators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, the platform or any loss of local browser data.
        </p>
      </section>

      {/* 7. Contact Information */}
      <section className="space-y-3 pt-4 text-sm text-stone-700 border-t border-[#EAE4D9] leading-relaxed">
        <h2 className="text-base font-bold text-stone-800">
          5. Contact & Updates
        </h2>
        <p>
          We may update these terms occasionally to reflect new platform capabilities. Changes will be posted on this page with an updated revision date.
        </p>
        <p>
          If you have questions regarding these terms or want to review how local browser data is handled, read our <Link to="/privacy" className="text-[#3D684A] font-semibold hover:underline">Privacy Policy</Link>, visit our <Link to="/contact" className="text-[#3D684A] font-semibold hover:underline">Contact Us page</Link>, or email <a href="mailto:hateemtahir4@gmail.com" className="text-[#3D684A] font-semibold hover:underline break-all inline-block py-0.5">hateemtahir4@gmail.com</a>.
        </p>
      </section>
    </div>
  );
};
