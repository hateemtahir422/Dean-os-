import React, { useEffect } from 'react';
import {
  Compass,
  Shield,
  Heart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Users,
  Target,
  Clock,
  Flame,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Link, updatePageMeta } from '../utils/router';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updatePageMeta(
      "About Dean's Daily OS – Calm Routine & Growth Platform",
      "Discover the mission behind Dean's Daily OS: helping students, freelancers, and everyday people build steady habits privately."
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header & Mission */}
      <div className="space-y-4 text-center sm:text-left border-b border-[#EAE4D9] pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#285737] text-xs font-semibold border border-[#BCDDC7]">
          <Compass className="w-3.5 h-3.5" />
          <span>Our Mission & Purpose</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
          About Dean's Daily OS
        </h1>
        <p className="text-base text-stone-600 leading-relaxed max-w-2xl font-normal">
          Dean's Daily OS is a calm, distraction-free personal growth platform and routine organizer. We help people establish sustainable daily rhythms, build lasting self-discipline, and break free from unwanted habits with <Link to="/privacy" className="text-[#3D684A] font-semibold hover:underline">on-device browser privacy</Link>.
        </p>
      </div>

      {/* 2. Platform Purpose & Core Philosophy */}
      <section className="space-y-5 text-stone-700 leading-relaxed text-sm sm:text-base">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
          The Purpose Behind Dean's Daily OS
        </h2>
        <p>
          Most productivity software has become noisy, complicated, and anxiety-inducing. Between elaborate Kanban boards, complex relational databases, notification overload, and punishing streak trackers that shame you for taking a sick day, the tools meant to support our lives often demand more energy than the work itself.
        </p>
        <p>
          Dean's Daily OS was built on a different principle: <strong>calm intentionality</strong>. We believe that true personal discipline is not about obsessively quantifying every minute or maintaining artificial metrics for basic human living. It is about having a clear, dependable scaffolding for each day—waking with purpose, staying hydrated, showing up for deep study or client work, stepping away for restorative pause, honoring personal reflection, and closing the evening with closure.
        </p>
      </section>

      {/* 3. Who The Platform Is Intended To Help */}
      <section className="space-y-6 pt-2">
        <div className="flex items-center gap-2 text-stone-800 font-bold text-xl sm:text-2xl">
          <Users className="w-5 h-5 text-[#4A7C59]" />
          <h2>Who This Platform Is Intended to Help</h2>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          Dean's Daily OS was designed for anyone seeking a simpler, grounded way to navigate their days:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#EBE4D8] space-y-2 shadow-2xs">
            <h3 className="text-base sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A7C59] shrink-0" />
              Students & Academy Learners
            </h3>
            <p className="text-sm sm:text-xs text-stone-600 leading-relaxed">
              Balancing long academic days, multiple study blocks, and evening classes without burning out or losing track of personal health.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EBE4D8] space-y-2 shadow-2xs">
            <h3 className="text-base sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A7C59] shrink-0" />
              Freelancers & Independent Creators
            </h3>
            <p className="text-sm sm:text-xs text-stone-600 leading-relaxed">
              Structuring flexible hours into disciplined time blocks for client delivery, skill improvement, and business outreach.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EBE4D8] space-y-2 shadow-2xs">
            <h3 className="text-base sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A7C59] shrink-0" />
              Individuals Overcoming Unwanted Habits
            </h3>
            <p className="text-sm sm:text-xs text-stone-600 leading-relaxed">
              People working to quit a specific stubborn behavior (like late-night phone doomscrolling) using an honest, isolated daily check-in that never mixes with daily chores.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EBE4D8] space-y-2 shadow-2xs">
            <h3 className="text-base sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4A7C59] shrink-0" />
              Anyone Seeking Peaceful Structure
            </h3>
            <p className="text-sm sm:text-xs text-stone-600 leading-relaxed">
              Anyone tired of overwhelming corporate project management tools who just wants a welcoming, clean checklist that respects their privacy.
            </p>
          </div>
        </div>
      </section>

      {/* 4. What Visitors Can Use It For */}
      <section className="space-y-6 pt-2">
        <div className="flex items-center gap-2 text-stone-800 font-bold text-xl sm:text-2xl">
          <Target className="w-5 h-5 text-[#4A7C59]" />
          <h2>What Visitors Can Use It For</h2>
        </div>

        <div className="rounded-3xl bg-[#FAF6F0] border border-[#E8DEC9] p-6 sm:p-8 space-y-4">
          <p className="text-sm text-stone-700 leading-relaxed font-medium">
            Visitors have full access to both the public personal growth library and the interactive on-device routine tool:
          </p>

          <ul className="space-y-3.5 text-sm text-stone-600 leading-relaxed">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-1" />
              <div>
                <strong className="text-stone-800">Customizable Daily Schedule:</strong> Follow or modify the pre-loaded 8-slot daily schedule. Add new tasks, edit times, delete items, or reorder tasks with up/down arrows.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-1" />
              <div>
                <strong className="text-stone-800">Calm Progress Monitoring:</strong> Check off routines and subtasks with gentle audio chimes. See your daily completion percentage without artificial score penalties.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-1" />
              <div>
                <strong className="text-stone-800">Dedicated Habit Cessation Tracker:</strong> Privately enter the single bad habit you wish to quit. Answer one simple daily Yes/No question with milestone fanfares and compassionate slip reflections.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-1" />
              <div>
                <strong className="text-stone-800">Optional Prayer & Timing Configuration:</strong> Toggle prayer timings and peaceful reminders on or off based on your personal preference.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-1" />
              <div>
                <strong className="text-stone-800">Personal Growth Articles:</strong> Read in-depth, authentic guides on self-discipline, habit substitution, energy management, and mindful evening reflection.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-1" />
              <div>
                <strong className="text-stone-800">Safe Local Backups:</strong> Export a full <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200">.json</code> backup anytime to keep your history safely in your own hands.
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Our Commitment to Honesty */}
      <section className="space-y-4 text-sm text-stone-600 leading-relaxed border-t border-[#EAE4D9] pt-8">
        <h2 className="text-lg font-bold text-stone-800">
          Our Commitment to Honesty &amp; Simplicity
        </h2>
        <p>
          We do not claim to be a venture-backed tech corporation or boast artificial team sizes. Dean's Daily OS is an authentic, independent personal routine platform crafted with care, free for all visitors to use without accounts, paywalls, or privacy trade-offs. Have questions or suggestions? Visit our <Link to="/contact" className="text-[#3D684A] font-semibold hover:underline">Contact Us page</Link>.
        </p>
      </section>

      {/* 6. Action Callouts */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <Link
          to="/app"
          className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>Open Routine Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/resources"
          className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 text-sm font-semibold border border-stone-300 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#4A7C59]" />
          <span>Browse Resources</span>
        </Link>
      </div>
    </div>
  );
};
