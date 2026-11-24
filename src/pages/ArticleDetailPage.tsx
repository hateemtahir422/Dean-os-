import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ListOrdered,
  BookOpen,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { Link, updatePageMeta, getSiteOrigin } from '../utils/router';
import { ARTICLES, Article } from '../data/articles';

const RELATED_SLUG_MAP: Record<string, string[]> = {
  'how-to-build-a-daily-routine-that-works': [
    'how-to-plan-your-day-without-feeling-overwhelmed',
    'how-to-stay-consistent-when-you-dont-feel-motivated',
  ],
  'how-to-develop-self-discipline-without-motivation': [
    'how-to-stay-consistent-when-you-dont-feel-motivated',
    'how-to-break-bad-habits-and-replace-them',
  ],
  'how-to-break-bad-habits-and-replace-them': [
    'how-to-develop-self-discipline-without-motivation',
    'how-to-build-a-daily-routine-that-works',
  ],
  'how-to-stay-consistent-when-you-dont-feel-motivated': [
    'how-to-develop-self-discipline-without-motivation',
    'how-to-build-a-daily-routine-that-works',
  ],
  'how-to-plan-your-day-without-feeling-overwhelmed': [
    'how-to-build-a-daily-routine-that-works',
    'how-to-stay-consistent-when-you-dont-feel-motivated',
  ],
};

interface ArticleDetailPageProps {
  slug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug }) => {
  const article = ARTICLES.find((a) => a.slug === slug);

  useEffect(() => {
    if (article) {
      const pageTitle = `${article.title} | TechSSP`;
      const metaDesc = article.metaDescription || article.excerpt;
      const origin = getSiteOrigin();
      const pageUrl = `${origin}/resources/${article.slug}`;

      updatePageMeta(pageTitle, metaDesc, {
        isPrivate: false,
        type: 'article',
        canonicalUrl: pageUrl,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: metaDesc,
          datePublished: '2026-11-01',
          dateModified: '2026-11-17',
          articleSection: article.category,
          wordCount: 1200,
          inLanguage: 'en-US',
          author: {
            '@type': 'Organization',
            name: 'TechSSP',
            url: origin,
          },
          publisher: {
            '@type': 'Organization',
            name: 'TechSSP',
            url: origin,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': pageUrl,
          },
        },
      });
    } else {
      updatePageMeta(
        "Article Not Found | TechSSP",
        "The requested personal growth guide was not found on TechSSP.",
        true
      );
    }
  }, [article]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-800">Article Not Found</h1>
        <p className="text-sm text-stone-500">
          The article you were looking for does not exist or may have moved.
        </p>
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4A7C59] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Resources
        </Link>
      </div>
    );
  }

  // Topic-relevant related articles
  const mappedSlugs = RELATED_SLUG_MAP[article.slug] || [];
  const relatedArticles =
    mappedSlugs.length > 0
      ? mappedSlugs
          .map((s) => ARTICLES.find((a) => a.slug === s))
          .filter((a): a is Article => Boolean(a))
      : ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Back to Resources navigation link */}
      <div>
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 py-2 pr-3 min-h-[40px] text-sm sm:text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span>Back to Personal Growth Resources</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-[#EAE4D9] pb-8">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-stone-500">
          <span className="px-3 py-1 rounded-full bg-[#EBF4EE] text-[#285737] font-semibold border border-[#BCDDC7]">
            {article.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {article.publishedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-800 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
          {article.excerpt}
        </p>
      </header>

      {/* Key Takeaways Box */}
      {article.takeaways && article.takeaways.length > 0 && (
        <section aria-label="Key Takeaways" className="rounded-3xl bg-[#FAF6F0] border border-[#E8DEC9] p-5 sm:p-7 space-y-3 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B7F6B] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
            Key Takeaways
          </h2>
          <ul className="space-y-2.5">
            {article.takeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59] mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Structured Sections with Proper Heading Hierarchy */}
      <div className="space-y-10">
        {article.sections.map((sec, idx) => (
          <section key={idx} className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight leading-snug">
              {sec.heading}
            </h2>

            <p className="text-[15px] sm:text-base text-stone-700 leading-[1.75] font-normal">
              {sec.body}
            </p>

            {/* Common Mistakes to Avoid (if present) */}
            {sec.commonMistakes && sec.commonMistakes.length > 0 && (
              <div className="rounded-2xl bg-[#FFF9F5] border border-[#F4DEC8] p-5 sm:p-6 space-y-2.5 my-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E4D15] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C96420]" />
                  Common Mistakes to Avoid
                </h3>
                <ul className="space-y-2.5 text-sm text-stone-700">
                  {sec.commonMistakes.map((mistake, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2">
                      <span className="text-[#C96420] font-bold text-sm mt-0.5">•</span>
                      <span className="leading-relaxed">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Steps Callout (if present) */}
            {sec.practicalSteps && sec.practicalSteps.length > 0 && (
              <div className="rounded-2xl bg-white border border-[#EBE4D8] p-5 sm:p-6 space-y-3 shadow-2xs my-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[#4A7C59]" />
                  Practical Implementation Steps
                </h3>
                <ol className="space-y-2.5 text-sm text-stone-700">
                  {sec.practicalSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#EBF4EE] text-[#285737] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Real-World Concrete Example (if present) */}
            {sec.practicalExample && (
              <div className="rounded-2xl bg-[#FAF6F0] border border-[#E9E1D5] p-5 space-y-2.5 text-sm text-stone-700 leading-relaxed my-4">
                <h3 className="font-bold text-[#874913] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-[#C26B1E]" />
                  Realistic Example
                </h3>
                <div>
                  <strong className="text-stone-800">Scenario: </strong>
                  <span>{sec.practicalExample.scenario}</span>
                </div>
                <div>
                  <strong className="text-[#3D684A]">Practical Adjustment: </strong>
                  <span>{sec.practicalExample.implementation}</span>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Return to Resources Button */}
      <div className="pt-6 border-t border-[#EAE4D9] flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/resources"
          className="w-full sm:w-auto justify-center min-h-[44px] sm:min-h-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-sm sm:text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span>Browse All Personal Growth Articles</span>
        </Link>
        <div className="text-xs text-stone-400 text-center sm:text-right">
          Published by <Link to="/about" className="text-stone-600 hover:underline font-medium">TechSSP</Link> • Safe local wellness companion
        </div>
      </div>

      {/* Related Reading Section */}
      {relatedArticles.length > 0 && (
        <section aria-label="More Articles" className="space-y-4 pt-6">
          <h2 className="text-lg font-bold text-stone-800">
            Related Personal Growth Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                to={`/resources/${rel.slug}`}
                className="p-5 rounded-2xl bg-white border border-[#EBE4D8] hover:border-stone-300 transition-all shadow-2xs space-y-2 group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-[#4A7C59] mb-1">
                    {rel.category} • {rel.readTime}
                  </div>
                  <h3 className="text-base sm:text-sm font-bold text-stone-800 group-hover:text-[#3D684A] transition-colors leading-snug">
                    {rel.title}
                  </h3>
                  <p className="text-sm sm:text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="pt-3 text-xs font-bold text-[#3D684A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read {rel.category.toLowerCase()} guide <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA to practice */}
      <div className="rounded-3xl bg-[#EBF4EE] border border-[#BCDDC7] p-6 sm:p-8 space-y-4 shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-[#285737]">
            Put these insights into daily practice
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Organize steady hours and isolate your single bad habit in TechSSP.
          </p>
        </div>
        <Link
          to="/app"
          className="w-full sm:w-auto justify-center min-h-[44px] sm:min-h-0 px-5 py-3 rounded-2xl bg-[#4A7C59] hover:bg-[#3D684A] text-white text-sm font-semibold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Explore Your Daily Routine</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
