import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Shield,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Link, updatePageMeta } from '../utils/router';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    updatePageMeta(
      "Contact Us – Support & Feedback | Dean's Daily OS",
      "Contact Dean's Daily OS directly with routine feedback, personal growth article ideas, or privacy inquiries at hateemtahir4@gmail.com."
    );
  }, []);

  const recipientEmail = 'hateemtahir4@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(recipientEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyDraft = () => {
    const fullDraft = `From: ${name} (${email})\nSubject: ${subject || 'Inquiry regarding Dean\'s Daily OS'}\n\n${message}`;
    navigator.clipboard.writeText(fullDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const generateMailtoUrl = () => {
    const sub = encodeURIComponent(subject || `Inquiry from ${name || 'Visitor'} via Dean's Daily OS`);
    const body = encodeURIComponent(`Hello,\n\n${message}\n\nFrom,\n${name}\nEmail: ${email}`);
    return `mailto:${recipientEmail}?subject=${sub}&body=${body}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitted(true);
    // Trigger standard email client with pre-filled content
    const url = generateMailtoUrl();
    window.location.href = url;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-[#EAE4D9] pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#285737] text-xs font-semibold border border-[#BCDDC7]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Honest & Direct Communication</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl font-normal">
          Have feedback on your daily routine, ideas for new personal growth guides, or questions about the app? We welcome all genuine inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 2. Contact Information Cards */}
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-white border border-[#EBE4D8] space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF4EE] text-[#285737] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-800">
                Direct Email
              </h2>
              <p className="text-sm sm:text-xs text-stone-600 leading-relaxed mt-1">
                Reach the platform administrator directly at our genuine contact address:
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
              <span className="text-xs font-bold text-[#3D684A] block break-all select-all font-mono">
                {recipientEmail}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full min-h-[44px] sm:min-h-0 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] text-stone-700 text-sm sm:text-xs font-semibold border border-stone-200 transition-colors cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#4A7C59]" />
                  <span>Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-stone-500" />
                  <span>Copy Email Address</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E9E1D5] space-y-2 text-sm sm:text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Clock className="w-4 h-4 text-[#4A7C59]" />
              Response Time
            </div>
            <p className="leading-relaxed">
              We read every message personally and aim to respond within 24–48 hours on business days.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E9E1D5] space-y-2 text-sm sm:text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Shield className="w-4 h-4 text-[#4A7C59]" />
              Privacy Assurance
            </div>
            <p className="leading-relaxed">
              Your inquiry goes directly to a human inbox. We do not store your email in advertising databases or marketing lists. Read our <Link to="/privacy" className="text-[#3D684A] font-semibold hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* 3. Functional Contact Message Form */}
        <div className="md:col-span-2">
          <div className="rounded-3xl bg-white border border-[#EBE4D8] p-6 sm:p-8 space-y-6 shadow-xs">
            {submitted ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#EBF4EE] border border-[#BCDDC7] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#285737] flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-[#285737]">
                  Your Message Is Ready to Send!
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                  Because Dean's Daily OS does not keep a tracking database, your message was formatted for direct delivery to <strong className="inline-block break-all max-w-full">{recipientEmail}</strong>.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={generateMailtoUrl()}
                    className="w-full sm:w-auto justify-center min-h-[44px] sm:min-h-0 inline-flex items-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span>Open in Email App</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    className="w-full sm:w-auto justify-center min-h-[44px] sm:min-h-0 inline-flex items-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-sm sm:text-xs font-semibold border border-stone-300 transition-colors cursor-pointer"
                  >
                    {copiedDraft ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#4A7C59]" />
                        <span>Draft Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-stone-500" />
                        <span>Copy Message Draft</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="text-sm sm:text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer py-2"
                  >
                    Compose a new message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-800">
                    Send a Message
                  </h2>
                  <p className="text-sm sm:text-xs text-stone-500 mt-0.5 leading-relaxed">
                    Fill out the fields below. On submission, you can immediately send it via your email program or copy the draft.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dean, Sarah, Alex..."
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Routine question, feature suggestion, feedback..."
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your thoughts, questions, or ideas here..."
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-3 sm:py-2.5 text-sm sm:text-xs text-stone-800 focus:outline-none focus:border-[#4A7C59]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs sm:text-[11px] text-stone-500">
                    Direct delivery to <strong className="text-stone-700 break-all">{recipientEmail}</strong>
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[44px] sm:min-h-0 inline-flex items-center justify-center gap-1.5 px-5 py-3 sm:py-2.5 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
