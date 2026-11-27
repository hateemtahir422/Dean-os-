import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  Shield,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Link, updatePageMeta } from '../utils/router';

export const ContactPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    updatePageMeta(
      "Contact Us – Support & Feedback | TechSSP",
      "Contact TechSSP directly with routine feedback, personal growth article ideas, or privacy inquiries at hateemtahir4@gmail.com."
    );
  }, []);

  const recipientEmail = 'hateemtahir4@gmail.com';
  const mailtoHref = `mailto:${recipientEmail}`;

  const handleCopyEmail = async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(recipientEmail);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = recipientEmail;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        copied = document.execCommand('copy');
        document.body.removeChild(tempInput);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
      {/* 1. Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-[#EAE4D9] pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#285737] text-xs font-semibold border border-[#BCDDC7]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Honest &amp; Direct Communication</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl font-normal">
          Have feedback on your daily routine, ideas for new personal growth guides, or questions about TechSSP? Reach out directly by email.
        </p>
      </div>

      {/* 2. Primary Direct Email Card */}
      <div className="rounded-3xl bg-white border border-[#EBE4D8] p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#EBF4EE] text-[#285737] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-800">
              Direct Email
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mt-0.5">
              Click the email address below to open your email app and send a message directly:
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <a
            href={mailtoHref}
            className="text-sm sm:text-base font-bold text-[#3D684A] hover:underline break-all font-mono"
          >
            {recipientEmail}
          </a>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href={mailtoHref}
              className="min-h-[44px] sm:min-h-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span>Email Us</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="min-h-[44px] sm:min-h-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-white hover:bg-[#F2ECE1] text-stone-700 text-sm sm:text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#4A7C59]" />
                  <span>Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-stone-500" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Supporting Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E9E1D5] space-y-2 text-sm sm:text-xs text-stone-600">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm">
            <Clock className="w-4 h-4 text-[#4A7C59]" />
            Response Time
          </div>
          <p className="leading-relaxed">
            We read every message personally and aim to respond within 24–48 hours on business days.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E9E1D5] space-y-2 text-sm sm:text-xs text-stone-600">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 text-sm">
            <Shield className="w-4 h-4 text-[#4A7C59]" />
            Privacy Assurance
          </div>
          <p className="leading-relaxed">
            Your email goes directly to a human inbox. We do not store your email in advertising databases or marketing lists. Read our{' '}
            <Link to="/privacy" className="text-[#3D684A] font-semibold hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

