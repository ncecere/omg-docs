import slots from '@/lib/screenshot-slots.json';
import imported from '@/lib/screenshots.json';
import { ScreenshotZoom } from './screenshot-zoom';

type SlotName = keyof typeof slots;
type Slot = { alt: string; files?: string[]; phone?: boolean; hold?: string };
type Imported = Record<string, { src: string; width: number; height: number }>;

/**
 * A named screenshot slot. When `npm run screenshots` has imported the image
 * (lib/screenshots.json), it renders it with its width and height; otherwise it
 * renders a clearly marked placeholder, so a page never shows a broken image.
 * Screenshots come only from the fictional "Example University" demo instance.
 * Phone screenshots (`"phone": true`) are shown narrower and centred.
 * An imported image opens enlarged on click (ScreenshotZoom, the only client
 * component here); the <img> itself is still rendered on the server.
 */
export function Screenshot({ slot, caption }: { slot: SlotName; caption?: string }) {
  const meta = slots[slot] as Slot;
  const img = (imported as Imported)[slot];
  const phone = Boolean(meta.phone);

  if (img) {
    return (
      <figure className={`not-prose my-6 ${phone ? 'mx-auto max-w-[22rem]' : ''}`}>
        <ScreenshotZoom src={img.src} width={img.width} height={img.height} alt={meta.alt} caption={caption}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimised WebP */}
          <img
            src={img.src}
            alt={meta.alt}
            width={img.width}
            height={img.height}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-card border border-fd-border bg-fd-card shadow-brand-2"
          />
        </ScreenshotZoom>
        {caption ? (
          <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className={`not-prose my-6 flex w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-fd-border bg-fd-muted p-6 text-center ${
        phone ? 'mx-auto aspect-[390/844] max-w-[18rem]' : 'aspect-[16/10]'
      }`}
      data-screenshot-slot={slot}
    >
      <span className="rounded-md bg-fd-card px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Screenshot to come
      </span>
      <span className="max-w-prose text-sm text-fd-muted-foreground">{meta.alt}</span>
      <code className="text-xs text-fd-muted-foreground">{slot}</code>
      {caption ? <figcaption className="sr-only">{caption}</figcaption> : null}
    </figure>
  );
}
