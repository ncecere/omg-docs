#!/usr/bin/env node
// Checks every internal link in the static export (out/): the page must exist,
// and a #fragment must match an id on that page. Run after `npm run build`.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../out/', import.meta.url).pathname;
if (!existsSync(root)) {
  console.error('out/ not found: run `npm run build` first.');
  process.exit(2);
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === '_next') continue;
      yield* htmlFiles(p);
    } else if (name.endsWith('.html')) yield p;
  }
}

function fileFor(pathname) {
  const clean = decodeURIComponent(pathname.replace(/\/$/, '')) || '/';
  const candidates =
    clean === '/'
      ? ['index.html']
      : [clean.slice(1), `${clean.slice(1)}.html`, join(clean.slice(1), 'index.html')];
  return candidates.map((c) => join(root, c)).find((c) => existsSync(c) && statSync(c).isFile());
}

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

let problems = 0;
let checked = 0;
for (const file of htmlFiles(root)) {
  const rel = relative(root, file);
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/_next/')) continue;
    checked++;
    const [pathname, fragment] = href.split('#');
    const target = pathname ? fileFor(pathname.split('?')[0]) : file;
    if (!target) {
      console.log(`${rel}: broken link ${href}`);
      problems++;
      continue;
    }
    if (fragment && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(fragment))) {
      console.log(`${rel}: missing anchor ${href}`);
      problems++;
    }
  }
}

console.log(`${checked} internal links checked, ${problems} problem(s).`);
process.exit(problems ? 1 : 0);
