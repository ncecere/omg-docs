import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center gap-4 px-4 py-24">
        <p className="text-sm font-medium text-fd-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-fd-muted-foreground">
          This page doesn&apos;t exist, or it moved. Search the docs with the search box above
          (<kbd>⌘</kbd> <kbd>K</kbd> or <kbd>Ctrl</kbd> <kbd>K</kbd>), or start from one of these:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <Link className="text-brand-link underline" href="/">
              Docs home
            </Link>
          </li>
          <li>
            <Link className="text-brand-link underline" href="/docs/getting-started">
              Getting started
            </Link>
          </li>
          <li>
            <Link className="text-brand-link underline" href="/docs/using">
              Using the gateway
            </Link>
          </li>
          <li>
            <Link className="text-brand-link underline" href="/docs/administration">
              Administration
            </Link>
          </li>
          <li>
            <Link className="text-brand-link underline" href="/docs/api">
              API reference
            </Link>
          </li>
          <li>
            <Link className="text-brand-link underline" href="/docs/self-hosting">
              Self-hosting
            </Link>
          </li>
        </ul>
      </div>
    </HomeLayout>
  );
}
