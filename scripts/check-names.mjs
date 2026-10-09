#!/usr/bin/env node
// Runs after `next build` (npm's postbuild hook) over the static export in out/:
//  1. Fails if a page references another origin for scripts, styles, fonts,
//     images or frames: the site loads nothing from third parties at runtime.
//  2. Fails if the page text names a competing gateway or chat product. The
//     docs describe Open Model Gateway on its own terms.
//  3. Fails if "OMG" is used bare: never in a page title or heading 1, and on
//     each page only after "Open Model Gateway" has been written out once.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../out/', import.meta.url).pathname;
if (!existsSync(root)) {
  console.error('out/ not found: run `npm run build` first.');
  process.exit(2);
}

// Named competitors: other model gateways and proxies, and chat front ends.
const forbidden = [
  /lite\s*llm/i,
  /portkey/i,
  /helicone/i,
  /\bkong\b/i,
  /cloudflare\s+ai\s+gateway/i,
  /\bbifrost\b/i,
  /tensorzero/i,
  /open\s*webui/i,
  /librechat/i,
];

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === '_next') continue;
      yield* files(p);
    } else yield p;
  }
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
// Visible text only: drop scripts (the RSC payload repeats the text), styles and tags.
const textOf = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ');

const problems = [];
let pages = 0;
for (const file of files(root)) {
  const rel = relative(root, file);
  if (file.endsWith('.css')) {
    const css = readFileSync(file, 'utf8');
    for (const m of css.matchAll(/url\(\s*["']?(https?:)?\/\/[^)]*\)|@import\s+["']?(https?:)?\/\//g)) {
      problems.push(`${rel}: third-party url ${m[0].slice(0, 120)}`);
    }
    continue;
  }
  if (!file.endsWith('.html')) continue;
  pages++;
  const html = readFileSync(file, 'utf8');

  for (const m of html.matchAll(/<(script|link|img|iframe|source|video|audio)\b[^>]*\b(?:src|href|srcset)="(https?:)?\/\/([^"/]+)[^"]*"[^>]*>/g)) {
    const isCanonicalOrAlternate = m[1] === 'link' && /rel="(canonical|alternate)"/.test(m[0]);
    if (!isCanonicalOrAlternate) problems.push(`${rel}: third-party resource ${m[0].slice(0, 120)}`);
  }

  const text = textOf(html);
  for (const re of forbidden) {
    const hit = text.match(re);
    if (hit) problems.push(`${rel}: forbidden name "${hit[0]}"`);
  }

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '');
  if (/\bOMG\b/.test(title)) problems.push(`${rel}: bare "OMG" in the page title "${title}"`);
  for (const m of html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)) {
    if (/\bOMG\b/.test(textOf(m[1]))) problems.push(`${rel}: bare "OMG" in a heading 1`);
  }

  // The page's own content: the article (docs pages) or main (home, 404).
  const body = html.match(/<article\b[\s\S]*<\/article>/)?.[0] ?? html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '';
  const content = textOf(body);
  const firstShort = content.search(/\bOMG\b/);
  const firstLong = content.indexOf('Open Model Gateway');
  if (firstShort !== -1 && (firstLong === -1 || firstShort < firstLong)) {
    problems.push(`${rel}: "OMG" before "Open Model Gateway" is written out ("…${content.slice(Math.max(0, firstShort - 40), firstShort + 20)}…")`);
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`\ncheck-names: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log(`check-names: ${pages} pages; no third-party resources, competitor names or bare "OMG".`);
