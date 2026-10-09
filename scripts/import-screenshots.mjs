#!/usr/bin/env node
// Imports screenshots into public/images as optimised WebP, and records their
// sizes in lib/screenshots.json for the <Screenshot> component.
//
//   npm run screenshots              # import from $SCREENSHOTS_DIR or ../omg-assets/screenshots
//   npm run screenshots:check        # list the slots still missing, import nothing
//
// Slots are defined in lib/screenshot-slots.json. A slot's image is the first
// of its "files" (or the slot's own name) found in the screenshots directory,
// as .png, .webp or .jpg. A slot with "hold" is skipped, with its reason. Only
// use screenshots of the fictional "Example University" demo instance: never
// of a real install. See SCREENSHOTS.md for the capture list.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const here = import.meta.dirname;
const slots = JSON.parse(readFileSync(join(here, '../lib/screenshot-slots.json'), 'utf8'));
const manifestPath = join(here, '../lib/screenshots.json');
const outDir = join(here, '../public/images');
const srcDir = resolve(process.env.SCREENSHOTS_DIR ?? join(here, '../../omg-assets/screenshots'));
const checkOnly = process.argv.includes('--check');
const maxWidth = 1600;

const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const findSource = (slot) => {
  if (slots[slot].hold) return undefined;
  const names = slots[slot].files ?? [slot];
  for (const name of names) {
    const hit = ['png', 'webp', 'jpg', 'jpeg'].map((ext) => join(srcDir, `${name}.${ext}`)).find((p) => existsSync(p));
    if (hit) return hit;
  }
  return undefined;
};
const held = Object.entries(slots).filter(([, v]) => v.hold);
if (held.length) console.log(`Held back:\n${held.map(([k, v]) => `  ${k}: ${v.hold}`).join('\n')}\n`);

if (checkOnly) {
  const missing = Object.keys(slots).filter((s) => !manifest[s]);
  const available = missing.filter((s) => findSource(s));
  console.log(`${Object.keys(slots).length} slots, ${Object.keys(slots).length - missing.length} imported.`);
  if (missing.length) console.log(`Missing:\n${missing.map((s) => `  ${s}${findSource(s) ? '  (available to import)' : ''}`).join('\n')}`);
  process.exit(available.length ? 1 : 0);
}

const { default: sharp } = await import('sharp');
mkdirSync(outDir, { recursive: true });
let imported = 0;
for (const slot of Object.keys(slots)) {
  const src = findSource(slot);
  if (!src) continue;
  const out = join(outDir, `${slot}.webp`);
  const info = await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(out);
  manifest[slot] = { src: `/images/${slot}.webp`, width: info.width, height: info.height };
  imported++;
  console.log(`${slot}: ${src} -> public/images/${slot}.webp (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KiB)`);
}
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
const missing = Object.keys(slots).filter((s) => !sorted[s]);
console.log(`\n${imported} imported from ${srcDir}. ${missing.length} slot(s) still missing${missing.length ? `: ${missing.join(', ')}` : ''}.`);
