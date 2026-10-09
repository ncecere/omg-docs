# Open Model Gateway docs

The user, administrator and operator documentation for [Open Model Gateway](https://github.com/ncecere/open-model-gateway), the self-hosted AI model gateway for one enterprise. It's published at <https://docs.omg.bitop.dev>; the product's website is <https://omg.bitop.dev>. Both addresses, the repositories and the release the docs describe are in `lib/site.ts`.

These pages are for the people who call models through the gateway, the administrators who run an installation, and the operators who host it. The Open Model Gateway repository's own `docs/` folder stays the engineering record (contracts, design notes and runbooks). The docs describe **Open Model Gateway v0.3.0**, which is not yet released: they follow the `main` branch until it is tagged.

A static site: [Fumadocs](https://fumadocs.dev) on Next.js with `output: "export"`, TypeScript and Tailwind CSS v4, served by nginx in a container. Search is Fumadocs' built-in static index, searched in the browser. No tracking, no cookies, no external fonts or CDNs: Inter is self-hosted.

The **API reference** (`content/docs/api/`) is hand-written MDX. Open Model Gateway has no OpenAPI document yet; when it has one, the reference can be generated from it as the Grounded docs do.

## Local development

You need Node 22 and npm.

```sh
npm ci
npm run dev          # http://localhost:3000
```

| Command | Does |
|---|---|
| `npm run dev` | Development server with hot reload. |
| `npm run build` | The static export, in `out/`, followed by `check-names` (below). |
| `npm run check:links` | Checks every internal link and anchor in `out/` (run after a build). |
| `npm run typecheck` | TypeScript. |
| `npm start` | Serves `out/` locally. |
| `npm run screenshots` | Imports screenshots (below). |
| `npm run screenshots:check` | Lists screenshot slots that are still placeholders. |

`npm run build` runs `scripts/check-names.mjs` afterwards (npm's `postbuild`). It fails the build if a page loads anything from another origin, names a competing gateway or chat product, or uses "OMG" bare: in a page title, in a heading 1, or before "Open Model Gateway" has been written out on that page.

## Layout

```text
lib/site.ts                   the site and product addresses, repositories and the release described
app/brand.css                 the brand tokens for Tailwind v4, shared verbatim with the website
app/global.css                Tailwind, Fumadocs' CSS, and Fumadocs' variables mapped onto brand.css
app/(home)/page.tsx           the landing page
app/docs/[[...slug]]/page.tsx docs pages
app/api/search/route.ts       the static search index (exported as /api/search)
app/not-found.tsx             the 404 page
content/docs/                 the pages, in MDX, one folder per section (meta.json orders them)
components/logo.tsx           the logo: the "Portal" mark (inline SVG) beside the name as live text
components/screenshot.tsx     named screenshot slots, with a marked placeholder until an image exists
lib/screenshot-slots.json     the slots and their alt text
lib/screenshots.json          imported screenshots and their sizes (written by the import script)
public/                       favicons, apple-touch-icon, 192/512 icons and og.png, copied from omg-assets
scripts/                      import-screenshots, check-links, check-names
nginx/                        nginx.conf and the site's server block and security headers
Dockerfile                    builds the export, then serves it with nginx
SCREENSHOTS.md                the capture list for the screenshot session
```

## Writing

- Every claim must be true of the Open Model Gateway release the docs describe. Check it against the repository (`README.md`, `docs/*.md`, `.env.example`, `deploy/`, `Dockerfile`, `apps/gateway/enterprise_migrations/`) and, where those are vague, the code (`apps/gateway/src`, `apps/web/src`), before you write it.
- Lead with "Open Model Gateway" in titles and first mentions; "OMG" is fine afterwards. `check-names` enforces it.
- Plain, short sentences. Examples are generic: "Example University", `example.edu`, model names such as `example/chat`. No real organisation's names or data, and no competitor names.
- Text about work that isn't merged yet carries a marker comment. Versioned signed release images, the 0.3.0 version bump, `docs/releases/` and `SECURITY.md` (being added on the gateway's release preparation) are marked `{/* verify after release-prep */}`. Check those sentences against the repository once it lands, then remove the comments (`grep -rn "verify after" content`).
- Use Fumadocs' components where they help: `Callout`, `Steps`, `Tabs`, `Cards`, `Files`.
- Each page has an "Edit on GitHub" link to its file in this repository.

### Brand

`app/brand.css` holds the colours, radii, shadows and fonts as `--omg-*` variables and Tailwind utilities (`bg-brand-surface`, `text-brand-link`, `rounded-card`, `shadow-brand-2`). The values come from the dashboard's Bitop UI theme (`apps/web/src/components/ui/themes/neutral.css` and `styles/tokens.css`: slate neutrals with an indigo accent, following the system colour scheme), with the WCAG 2.1 contrast ratios noted in its comments. The same file is meant to be used verbatim by the Open Model Gateway website: change both together.

### Logo

The logo is "Portal" (a tunnel seen slightly off-axis: two light bands receding to an indigo core, on a dark tile); its source, exports and usage rules are in `../omg-assets/logo/` (`logo/portal/`, `logo/README.md`). `components/logo.tsx` draws the mark inline (`mark-small.svg`, 28 px, `aria-hidden`) beside the name as live text, exactly as the website does; change both together. `public/favicon.ico`, `favicon.svg`, `icon-192.png` and `icon-512.png` are copied unchanged from `logo/portal/` (the PNGs from its `png/` folder, with `apple-touch-icon.png`), and `public/og.png` is its `png/og-card.png`. When the logo changes, copy them again:

```sh
L=../omg-assets/logo/portal
cp $L/favicon.ico $L/favicon.svg public/ && cp $L/png/apple-touch-icon.png $L/png/icon-192.png $L/png/icon-512.png public/ && cp $L/png/og-card.png public/og.png
```

### Screenshots

Screenshots come only from the fictional "Example University" demo instance, never from a real install. Each image has a named slot in `lib/screenshot-slots.json` (its alt text, the file names it may have, `"phone": true` for phone captures, and optionally a `hold` reason that keeps a capture out) and is placed with `<Screenshot slot="…" />`. Until an image is imported, the slot shows a clearly marked placeholder. `SCREENSHOTS.md` lists, per slot, the file, size, page, persona and the state to set up. None has been captured yet. When you replace an image, check that its slot's alt text still describes it.

```sh
SCREENSHOTS_DIR=../omg-assets/screenshots npm run screenshots
```

converts each available PNG to WebP (at most 1600 px wide) in `public/images/`, and records its width and height in `lib/screenshots.json`.

## Container

```sh
docker build -t omg-docs .
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp:uid=101,gid=101 omg-docs
```

nginx (Alpine, pinned by digest) runs as user 101 on port 8080, keeps its pid and temp files under `/tmp` (so the root filesystem can be read-only; mount an `emptyDir` at `/tmp` in Kubernetes), answers `/healthz`, sends security headers and a Content Security Policy, gzips text, and caches hashed assets for a year.

## Deploy

Pushes to `main` run `.github/workflows/publish.yaml`: it type-checks, builds (including `check-names`) and link-checks the site, then builds and pushes a multi-arch image (linux/amd64, linux/arm64):

- `ghcr.io/ncecere/omg-docs:<full commit sha>`
- `ghcr.io/ncecere/omg-docs:latest`

Pull requests run the checks only. Actions are pinned by commit SHA, and Dependabot opens grouped weekly updates for npm, Actions and the Docker base images.

## Licence

- **Code** (the site's source, scripts and configuration): [MIT](LICENSE).
- **Documentation text and images**: [Creative Commons Attribution 4.0 International](LICENSE-CONTENT) (CC BY 4.0).
- Inter is under the SIL Open Font License 1.1.
