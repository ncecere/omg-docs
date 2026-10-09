import type { Metadata, Viewport } from 'next';
import { Provider } from '@/components/provider';
import { siteUrl } from '@/lib/site';
import './global.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s · Open Model Gateway docs',
    default: 'Open Model Gateway docs',
  },
  description:
    'Documentation for Open Model Gateway, the self-hosted AI model gateway for one enterprise: calling models, administering access and spending, and running it.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  // Open Graph card (public/og.png, the logo's og-card.png). Titles and descriptions come
  // from each page's own <title> and description.
  openGraph: {
    type: 'website',
    siteName: 'Open Model Gateway docs',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Open Model Gateway: one governed API for every AI model',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d12' },
  ],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
