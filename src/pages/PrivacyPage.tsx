import React, { useEffect } from 'react';
import {
  Shield,
  Lock,
  EyeOff,
  HardDrive,
  Database,
  Trash2,
  Download,
  Volume2,
} from 'lucide-react';
import { Link, updatePageMeta } from '../utils/router';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    updatePageMeta(
      "Privacy Policy – Local Storage & Privacy | TechSSP",
      "Review TechSSP Privacy Policy: 9 localStorage keys, zero tracking cookies or external analytics, Contact email handling, and erasure."
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* 1. Header */}
      <div className="space-y-3 border-b border-[#EAE4D9] pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#285737] text-xs font-semibold border border-[#BCDDC7]">
          <Shield className="w-3.5 h-3.5" />
          <span>Codebase-Audited Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-stone-500">
          Last reviewed &amp; code-verified: November 24, 2026
        </p>
      </div>

      {/* 2. Executive Summary */}
      <div className="rounded-3xl bg-[#FAF6F0] border border-[#E8DEC9] p-6 sm:p-7 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B7F6B] flex items-center gap-1.5">
          <Lock className="w-4 h-4" />
          Summary: On-Device Local Storage Architecture
        </h2>
        <p className="text-sm text-stone-700 leading-relaxed font-normal">
          TechSSP operates on a client-side, local-first architecture. <strong>The application does not run a remote user database, does not require account registration, and makes zero background API calls to transmit your daily routines, checklists, or habit answers to external servers.</strong> Your routine and habit entries are stored inside your web browser's local storage on your device (except if you voluntarily choose to send us an email via the Contact page).
        </p>
      </div>

      {/* 3. Section 1: Exact Information Stored */}
      <section className="space-y-4 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>1. What Information Is Collected and Stored</span>
        </h2>
        <p>
          Any routine customizations, completion logs, preferences, and habit check-ins you enter in the dashboard are saved in your browser using standard HTML5 <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">localStorage</code> under the following keys (retaining internal <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">deans_os_*_v1</code> prefixes so existing users&apos; saved routines and streaks are preserved):
        </p>

        <div className="rounded-2xl border border-[#EBE4D8] overflow-hidden bg-white">
          <div className="divide-y divide-stone-100">
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_preferences_v1</span>
              <span className="text-stone-500">Preferred greeting name, onboarding status, and prayer tracking toggle.</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs bg-[#FAF9F6]">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_tasks_v1</span>
              <span className="text-stone-500">List of daily tasks, time slots, categories, notes, order, and subtasks.</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_records_v1</span>
              <span className="text-stone-500">Historical task and subtask completion status organized by date (YYYY-MM-DD).</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs bg-[#FAF9F6]">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_habit_v1</span>
              <span className="text-stone-500">Name of the target bad habit you track, start date, and daily Yes/No check-in responses.</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_prayer_config_v1</span>
              <span className="text-stone-500">Prayer calculation parameters (default Karachi coordinates/method), minute offsets, and reminder toggles.</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs bg-[#FAF9F6]">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_prayer_records_v1</span>
              <span className="text-stone-500">Daily prayer check-off history (Fajr, Dhuhr, Asr, Maghrib, Isha).</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_academy_v1</span>
              <span className="text-stone-500">Configured academy or class name, schedule timings, active weekdays, notes, and reminder lead times.</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs bg-[#FAF9F6]">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_prospects_v1</span>
              <span className="text-stone-500">Legacy outreach list key (hidden from the active UI, but still read from defaults during JSON backup export and written if present in an imported backup file).</span>
            </div>
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-sm sm:text-xs">
              <span className="font-mono font-bold text-stone-800 break-all">deans_os_projects_v1</span>
              <span className="text-stone-500">Legacy freelance project key (hidden from the active UI, but still read from defaults during JSON backup export and written if present in an imported backup file).</span>
            </div>
          </div>
        </div>

        <p>
          <strong>Contact Us Form Input:</strong> On the Contact Us page, the name, email address, subject, and message you type are kept only in temporary browser memory while you compose them—they are never saved to <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">localStorage</code> or uploaded to a form backend. When you submit the form, the browser triggers a <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">mailto:</code> link to open your own email app so you can voluntarily send that message to <span className="font-mono text-xs">hateemtahir4@gmail.com</span>.
        </p>
      </section>

      {/* 4. Section 2: Storage Location (Local vs Remote) */}
      <section className="space-y-4 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>2. Local vs. Remote Storage &amp; Important Limitations</span>
        </h2>
        <p>
          All application routine, habit, prayer, and preference records are stored <strong>100% locally in your browser</strong>. TechSSP does not operate user accounts, cloud sync servers, or remote analytics databases, and its client-side code never uploads your stored dashboard data over the network.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-stone-600">
          <li><strong>Unencrypted Local Storage:</strong> Browser <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">localStorage</code> entries (and exported <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">.json</code> backup files) are stored in plain text without client-side encryption. Anyone with access to your unlocked device or browser profile—or browser extensions with page access—could view or modify them.</li>
          <li><strong>Standard Hosting Access Logs:</strong> While the application code sends no telemetry, the web server or cloud hosting infrastructure delivering the website's static HTML/JS files may record standard HTTP server access logs (such as IP address, timestamp, requested URL, and browser user agent) outside this application's control.</li>
          <li><strong>Voluntary Email Correspondence:</strong> If you choose to send an email via your email client using the Contact Us page, the sender details and message you transmit will be stored in the administrator's email inbox to respond to your inquiry.</li>
        </ul>
      </section>

      {/* 5. Section 3: Cookies & Tracking Technologies */}
      <section className="space-y-4 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>3. Cookies and Tracking Technologies</span>
        </h2>
        <p>
          The TechSSP application code does <strong>NOT set or read cookies</strong> and does not use <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">sessionStorage</code> or <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">IndexedDB</code>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
          <li>The codebase sets zero HTTP or JavaScript tracking/advertising cookies.</li>
          <li>We do not embed session replay tools, fingerprinting scripts, or advertising SDKs.</li>
          <li>We do not sell, rent, or share your routine or habit data with third parties.</li>
        </ul>
      </section>

      {/* 6. Section 4: Third-Party Services & Browser APIs */}
      <section className="space-y-4 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>4. External Scripts &amp; Web Browser APIs</span>
        </h2>
        <p>
          Inspection of the HTML and application bundle confirms that the frontend loads <strong>no third-party analytics scripts, external font CDNs, or external API requests</strong> during normal browsing. Features rely strictly on standard browser APIs:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-stone-600">
          <li><strong>No External Analytics:</strong> Google Analytics, Meta Pixels, Hotjar, and similar trackers are not installed or loaded.</li>
          <li><strong>Local Astronomical Calculations:</strong> Prayer times are calculated mathematically inside your browser's JavaScript engine using locally stored coordinates (defaulting to Karachi, Pakistan) without contacting external prayer APIs or requesting GPS geolocation.</li>
          <li><strong>Synthesized Audio Chimes:</strong> Completion tones are generated locally using the HTML5 Web Audio API (<code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">AudioContext</code>) with no external audio downloads.</li>
          <li><strong>Browser Notifications:</strong> If you explicitly grant permission, routine and prayer alerts trigger locally via the browser's <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">Notification</code> API. You can revoke permission anytime in browser site settings.</li>
          <li><strong>Clipboard &amp; Local File APIs:</strong> Contact copy buttons use <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">navigator.clipboard.writeText</code> only when clicked, and Settings backup/restore uses client-side <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">Blob</code> and <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-800">FileReader</code> APIs without uploading files to any server.</li>
        </ul>
      </section>

      {/* 7. Section 5: How Users Can Manage or Delete Their Data */}
      <section className="space-y-4 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-[#4A7C59] shrink-0" />
          <span>5. How Users Can Manage, Export, or Delete Their Data</span>
        </h2>
        <p>
          Because dashboard records remain in your browser, you control when they are exported or removed:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-white border border-[#EBE4D8] space-y-2 shadow-2xs">
            <h3 className="text-sm sm:text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#4A7C59]" />
              Export &amp; Backup
            </h3>
            <p className="text-sm sm:text-xs text-stone-600 leading-relaxed">
              In the Settings view of the routine dashboard, click <strong>"Download Personal Backup (.json)"</strong> to save a local JSON export of all stored routine tasks, completion history, habit check-ins, prayer logs, preferences, and backup legacy fields.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#EBE4D8] space-y-2 shadow-2xs">
            <h3 className="text-sm sm:text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Full Erasure vs. Schedule Reset
            </h3>
            <p className="text-sm sm:text-xs text-stone-600 leading-relaxed">
              Note that clicking <strong>"Restore Default Routine Schedule"</strong> in Settings only resets your daily task list. To permanently erase all stored records, preferences, and habit logs, clear your browser's <strong>Site Data / Local Storage</strong> for this website via browser settings (and delete any downloaded JSON backup files from your device).
            </p>
          </div>
        </div>
      </section>

      {/* 8. Contact for Privacy Inquiries */}
      <section className="space-y-3 pt-4 text-sm text-stone-700 border-t border-[#EAE4D9] leading-relaxed">
        <h2 className="text-base font-bold text-stone-800">
          6. Questions or Inquiries
        </h2>
        <p>
          If you have questions about our on-device storage model or wish to request deletion of prior email correspondence, please email us directly at <a href="mailto:hateemtahir4@gmail.com" className="text-[#3D684A] font-semibold hover:underline break-all inline-block py-0.5">hateemtahir4@gmail.com</a>, use our <Link to="/contact" className="text-[#3D684A] font-semibold hover:underline">Contact Us page</Link>, or review our <Link to="/terms" className="text-[#3D684A] font-semibold hover:underline">Terms of Service</Link>.
        </p>
      </section>
    </div>
  );
};
