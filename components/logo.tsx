/*
 * The Open Model Gateway logo, "Portal": a tunnel seen slightly off-axis, two
 * light bands receding to an indigo core, on a dark tile. The mark is inline
 * SVG (no request, no font), copied from mark-small.svg in omg-assets
 * (logo/portal/), the drawing for 20 to 47 px; the name beside it is live text.
 * The website draws the same mark at the same size.
 */

/** The mark: decorative here, because the name is always next to it. */
export function OmgMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={`shrink-0 ${className}`}>
      <rect width="64" height="64" rx="14" fill="#161a22" />
      <path
        d="M11.5 32A20.5 20.5 0 1 0 52.5 32A20.5 20.5 0 1 0 11.5 32ZM19.6 30.4A14 14 0 1 0 47.6 30.4A14 14 0 1 0 19.6 30.4Z"
        fill="#f7f8fa"
        fillRule="evenodd"
      />
      <path
        d="M25.2 28.8A10 10 0 1 0 45.2 28.8A10 10 0 1 0 25.2 28.8ZM30.05 27.7A6.25 6.25 0 1 0 42.55 27.7A6.25 6.25 0 1 0 30.05 27.7Z"
        fill="#f7f8fa"
        fillRule="evenodd"
      />
      <circle cx="37.1" cy="26.9" r="3.25" fill="#7f86f2" />
    </svg>
  );
}

/** The product's full name as text, set in Inter (used inline in sentences too). */
export function OmgWordmark({ className }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight whitespace-nowrap ${className ?? ''}`}>Open Model Gateway</span>
  );
}

/**
 * The nav bar title: the mark, the name and a "docs" tag. `antialiased`
 * matches the website, whose body sets it, so the name renders identically.
 */
export function NavTitle() {
  return (
    <span className="inline-flex items-center gap-2.5 text-fd-foreground antialiased">
      <OmgMark />
      <OmgWordmark className="text-[1.05rem]" />
      <span className="rounded-md border border-fd-border px-1.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
        docs
      </span>
    </span>
  );
}
