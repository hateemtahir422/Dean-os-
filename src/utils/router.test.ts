import test from 'node:test';
import assert from 'node:assert';
import { parsePath, normalizeSiteUrl, normalizePathname } from './router';
import { ARTICLES } from '../data/articles';

test('router parsing: parses clean public paths correctly', () => {
  assert.deepStrictEqual(parsePath('/'), { path: '/', route: 'home' });
  assert.deepStrictEqual(parsePath('/about'), { path: '/about', route: 'about' });
  assert.deepStrictEqual(parsePath('/resources'), { path: '/resources', route: 'resources' });
  assert.deepStrictEqual(parsePath('/contact'), { path: '/contact', route: 'contact' });
  assert.deepStrictEqual(parsePath('/privacy'), { path: '/privacy', route: 'privacy' });
  assert.deepStrictEqual(parsePath('/terms'), { path: '/terms', route: 'terms' });
  assert.deepStrictEqual(parsePath('/app'), { path: '/app', route: 'app' });
  assert.deepStrictEqual(parsePath('/dashboard'), { path: '/dashboard', route: 'app' });
});

test('router SEO helpers: normalizes paths and site URLs safely', () => {
  assert.strictEqual(normalizePathname('/'), '/');
  assert.strictEqual(normalizePathname('/about/'), '/about');
  assert.strictEqual(normalizeSiteUrl('https://example.org/'), 'https://example.org');
  assert.strictEqual(normalizeSiteUrl('not-a-url'), '');
});

test('router parsing: parses article slugs with parameters', () => {
  const result = parsePath('/resources/how-to-build-a-daily-routine-that-works');
  assert.strictEqual(result.route, 'article');
  assert.strictEqual(result.slug, 'how-to-build-a-daily-routine-that-works');
});

test('articles repository: contains all 5 required articles with complete structured content', () => {
  assert.strictEqual(ARTICLES.length, 5);

  const expectedTitles = [
    'How to Build a Daily Routine That Actually Works',
    'How to Develop Self-Discipline Without Depending on Motivation',
    'How to Break Bad Habits and Replace Them With Better Ones',
    'How to Stay Consistent When You Don\'t Feel Motivated',
    'How to Plan Your Day Without Feeling Overwhelmed',
  ];

  const actualTitles = ARTICLES.map((a) => a.title);
  assert.deepStrictEqual(actualTitles, expectedTitles);

  const categories = new Set(ARTICLES.map((a) => a.category));
  assert.ok(categories.has('Daily Routines'));
  assert.ok(categories.has('Habit Building'));
  assert.ok(categories.has('Self-Discipline'));
  assert.ok(categories.has('Personal Development'));

  for (const article of ARTICLES) {
    assert.ok(article.slug.length > 0);
    assert.ok(article.title.length > 0);
    assert.ok(article.excerpt.length > 0);
    assert.ok(article.metaDescription.length > 0);
    assert.ok(article.sections.length >= 4);
    assert.ok(article.takeaways.length >= 3);

    for (const section of article.sections) {
      assert.ok(section.heading.length > 0);
      assert.ok(section.body.length > 0);
    }

    // Ensure at least one section has practical steps
    const hasPracticalSteps = article.sections.some(
      (sec) => sec.practicalSteps && sec.practicalSteps.length > 0
    );
    assert.ok(hasPracticalSteps, `Article "${article.title}" must have practical steps`);

    // Ensure at least one section has a realistic example
    const hasPracticalExample = article.sections.some(
      (sec) => sec.practicalExample && sec.practicalExample.scenario && sec.practicalExample.implementation
    );
    assert.ok(hasPracticalExample, `Article "${article.title}" must have a realistic example`);

    // Ensure at least one section explains common mistakes
    const hasCommonMistakes = article.sections.some(
      (sec) => sec.commonMistakes && sec.commonMistakes.length > 0
    );
    assert.ok(hasCommonMistakes, `Article "${article.title}" must explain common mistakes`);
  }
});
