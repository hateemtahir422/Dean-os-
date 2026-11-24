import React, { useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
  Clock,
  Shield,
  HeartHandshake,
  BookOpen,
  Compass,
  Smile,
} from 'lucide-react';
import { Link, updatePageMeta } from '../utils/router';
import { ARTICLES } from '../data/articles';

export const HomePage: React.FC = () => {
  useEffect(() => {
    updatePageMeta(
      "TechSSP – Personal Growth & Daily Routine Platform",
      "Build calm daily routines, track a bad-habit streak separately, and stay consistent on your device with zero ads or signups."
    );
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-14">
      {/* 1. Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4EE] border border-[#BCDDC7] text-xs font-semibold text-[#285737] shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3D684A]" />
          <span>Calm Personal Routine & Habit Companion</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-800 tracking-tight leading-tight">
          Build calmer days, one mindful routine at a time.
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          TechSSP is an intentional personal growth platform designed to help you organize your daily hours, build steady self-discipline, and break free from unwanted habits—without stressful gamification or complex productivity clutter.
        </p>

        {/* Clear Primary Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm font-bold shadow-sm transition-all hover:shadow-md cursor-pointer group"
          >
            <span>Explore Your Daily Routine</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/resources"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 text-sm font-semibold border border-stone-300 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#4A7C59]" />
            <span>Read Growth Guides</span>
          </Link>
        </div>

        {/* Quiet Reassurance Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" /> 100% Free & Open Access
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#4A7C59]" /> Private on Your Device
          </span>
          <span className="flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-[#4A7C59]" /> Zero Ads or Telemetry
          </span>
        </div>
      </section>

      {/* 2. Visual Platform Overview (Card Grid) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
            Designed for genuine daily clarity
          </h2>
          <p className="text-sm text-stone-500">
            A minimalist architecture focused on steady progress rather than stressful streak anxiety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Mindful Checklist */}
          <div className="rounded-3xl bg-white border border-[#EBE4D8] p-6 sm:p-7 space-y-4 shadow-xs hover:border-[#D5E3D8] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EBF4EE] border border-[#BCDDC7] flex items-center justify-center text-[#285737]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">
              Structured Daily Flow
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Anchor your day around realistic time blocks: morning preparation, focused study, restorative breaks, and evening review. Easily reorder, customize, or add your own daily routines.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#3D684A]">
              Simple checkboxes • Daily completion %
            </div>
          </div>

          {/* Feature 2: Separated Habit Tracker */}
          <div className="rounded-3xl bg-[#FAF5EE] border border-[#EEDFCE] p-6 sm:p-7 space-y-4 shadow-xs hover:border-[#DFCCA7] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#F7E7D5] border border-[#ECCCA7] flex items-center justify-center text-[#935218]">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">
              Dedicated Habit Journey
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Kept completely separate from routine tasks. Dedicated solely to the single bad habit you want to quit—with honest Yes/No check-ins, compassionate slip reflection, and milestone fanfares.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#935218]">
              One focus habit • Non-punitive reflections
            </div>
          </div>

          {/* Feature 3: Optional Prayer & Quiet Timings */}
          <div className="rounded-3xl bg-white border border-[#EBE4D8] p-6 sm:p-7 space-y-4 shadow-xs hover:border-[#D5E3D8] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF2ED] border border-[#C5DDD0] flex items-center justify-center text-[#2C6242]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">
              Personalized Preferences
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Make prayer times active or tuck them away completely if you prefer a secular routine. Personalize your greeting name, configure audio chimes, and adjust academy or classes anytime.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#3D684A]">
              Optional prayer times • Gentle audio bells
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Philosophy Behind The OS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#FAF6F0] border border-[#E9E1D5] p-7 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B7F6B]">
            <Compass className="w-4 h-4" />
            Why We Chose Simplicity
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
            Productivity shouldn't feel like a second job.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-600 leading-relaxed">
            <p>
              Most productivity apps suffer from feature bloat: complex databases, intricate project boards, and notification barrage that create more stress than focus. When planning becomes exhausting, we abandon the app altogether.
            </p>
            <p>
              TechSSP was born from a desire for quiet, grounded intentionality. We believe that knowing what to do in the current hour, having a dependable routine, and closing the evening with a peaceful checklist is what truly fosters discipline.
            </p>
          </div>
          <div className="pt-1">
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 py-2 sm:py-0.5 text-sm sm:text-xs font-bold text-[#3D684A] hover:underline"
            >
              Read more about TechSSP&apos;s mission &amp; philosophy <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Resources Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#5B7F6B] uppercase tracking-wider block">
              Personal Growth Library
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight mt-1">
              Thoughtful articles on habit & discipline
            </h2>
          </div>
          <Link
            to="/resources"
            className="text-sm sm:text-xs font-bold text-[#3D684A] hover:underline inline-flex items-center gap-1 py-1.5 sm:py-0 self-start sm:self-auto"
          >
            Browse all personal growth articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.slice(0, 2).map((article) => (
            <Link
              key={article.slug}
              to={`/resources/${article.slug}`}
              className="block rounded-3xl bg-white border border-[#EBE4D8] p-6 sm:p-7 hover:border-stone-300 transition-all shadow-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-stone-700 font-semibold border border-[#EBE3D6]">
                  {article.category}
                </span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#3D684A] transition-colors mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <span className="text-xs font-bold text-[#3D684A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read {article.category.toLowerCase()} guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Bottom Welcome Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#EBF4EE] border border-[#BCDDC7] p-7 sm:p-10 text-center space-y-4 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#285737] tracking-tight">
            Ready to bring calm consistency to your day?
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            No signup forms or passwords required. Your routine is stored safely on your own device.
          </p>
          <div className="pt-2">
            <Link
              to="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm font-bold shadow-xs transition-all hover:shadow-sm cursor-pointer"
            >
              <span>Explore Your Daily Routine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
