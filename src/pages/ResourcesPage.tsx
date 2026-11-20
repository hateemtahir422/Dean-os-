import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Clock, Tag, Sparkles, Compass } from 'lucide-react';
import { Link, updatePageMeta, getSiteOrigin } from '../utils/router';
import { ARTICLES, Article } from '../data/articles';

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const origin = getSiteOrigin();
    const pageUrl = `${origin}/resources`;

    updatePageMeta(
      "Personal Growth & Daily Routine Resources – Dean's Daily OS",
      "Read practical guides on building daily routines, developing self-discipline without motivation, breaking bad habits, and calm planning.",
      {
        isPrivate: false,
        type: 'website',
        canonicalUrl: pageUrl,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: "Personal Growth & Daily Routine Resources – Dean's Daily OS",
          description:
            'Read practical guides on building daily routines, developing self-discipline without motivation, breaking bad habits, and calm planning.',
          url: pageUrl,
          hasPart: ARTICLES.map((article) => ({
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            url: `${origin}/resources/${article.slug}`,
          })),
        },
      }
    );
  }, []);

  const categories = [
    'All',
    'Daily Routines',
    'Habit Building',
    'Self-Discipline',
    'Personal Development',
  ];

  const filteredArticles =
    selectedCategory === 'All'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Page Header */}
      <header className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] text-[#285737] text-xs font-semibold border border-[#BCDDC7]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Personal Growth Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
          Practical Guides & Routine Insights
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Ground-level, realistic guides designed to help you build reliable daily rhythms, break unwanted habits through smart substitution, and maintain focus without relying on fleeting motivation.
        </p>
      </header>

      {/* Category Filter Tabs & Article Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE4D9] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4A7C59] text-white shadow-2xs'
                    : 'bg-white hover:bg-stone-50 text-stone-600 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-stone-400 font-medium">
          Showing {filteredArticles.length} of {ARTICLES.length} guides
        </div>
      </div>

      {/* Article Grid - Responsive, Organized, Readable Typography */}
      <section aria-label="Article Listing" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.slug}
            className="flex flex-col justify-between rounded-3xl bg-white border border-[#EBE4D8] p-6 sm:p-7 hover:border-stone-300 transition-all shadow-xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs text-stone-400">
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF6F0] text-stone-700 font-semibold border border-[#EBE3D6]">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] shrink-0">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-stone-800 group-hover:text-[#3D684A] transition-colors leading-snug">
                <Link to={`/resources/${article.slug}`} className="hover:underline">
                  {article.title}
                </Link>
              </h2>

              <p className="text-sm text-stone-500 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-5 border-t border-[#F2ECE1] mt-5 flex items-center justify-between text-xs">
              <span className="text-stone-400">{article.publishedDate}</span>
              <Link
                to={`/resources/${article.slug}`}
                className="text-[#3D684A] font-bold inline-flex items-center gap-1 py-2 -my-2 pl-2 group-hover:translate-x-1 transition-transform cursor-pointer"
                aria-label={`Read article: ${article.title}`}
              >
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Routine Companion Teaser */}
      <section aria-label="Practice Routine OS" className="rounded-3xl bg-[#FAF5EE] border border-[#EEDFCE] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-base font-bold text-stone-800">
            Put these ideas into daily practice
          </h2>
          <p className="text-sm sm:text-xs text-stone-600 leading-relaxed">
            Apply steady time blocks and habit tracking in Dean&apos;s Daily OS right now, or <Link to="/about" className="text-[#3D684A] font-semibold hover:underline">learn how our routine platform works</Link>.
          </p>
        </div>
        <Link
          to="/app"
          className="w-full sm:w-auto justify-center min-h-[44px] sm:min-h-0 px-5 py-3 sm:py-2.5 rounded-xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm sm:text-xs font-semibold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Explore Your Daily Routine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
};
