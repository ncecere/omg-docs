import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { BookOpen, Braces, KeyRound, Server, ShieldCheck, Tag } from 'lucide-react';
import { OmgWordmark } from '@/components/logo';
import { productRepo, productSite, productUnreleased, productVersion } from '@/lib/site';

const sections = [
  {
    title: 'Getting started',
    href: '/docs/getting-started',
    icon: <BookOpen />,
    description:
      'What Open Model Gateway is, the ideas it is built on, a quick tour of the dashboard and a local demo.',
  },
  {
    title: 'Using the gateway',
    href: '/docs/using',
    icon: <KeyRound />,
    description:
      'API keys, calling models with the OpenAI and Anthropic SDKs, logs, usage and costs, files, batches, realtime audio, alerts and workspace settings.',
  },
  {
    title: 'Administration',
    href: '/docs/administration',
    icon: <ShieldCheck />,
    description:
      'First run, people and roles, SSO groups and SCIM, connections, models, routes and prices, catalogs, limits and budgets, alerts, key safety, audit and settings.',
  },
  {
    title: 'API reference',
    href: '/docs/api',
    icon: <Braces />,
    description:
      'The inference endpoints and what each supports: chat completions, responses, messages, embeddings, images, audio, rerank, files, batches, realtime and models.',
  },
  {
    title: 'Self-hosting',
    href: '/docs/self-hosting',
    icon: <Server />,
    description:
      'The container, every configuration variable, the database and migrations, identity, provider credentials, file storage, monitoring, backups, upgrades and security.',
  },
  {
    title: 'Releases',
    href: '/docs/releases',
    icon: <Tag />,
    description: `What changed in each release. These docs describe ${productVersion}${productUnreleased ? ' (not yet released)' : ''}.`,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 md:py-16">
      <div className="flex flex-col gap-4">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
          <OmgWordmark /> {productVersion} documentation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          One gateway to every model your organisation uses.
        </h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          Open Model Gateway is a self-hosted AI model gateway for one enterprise. People and
          applications call cloud and self-hosted models through one API with their own keys;
          administrators decide who may use which models, set budgets and limits, and see what
          everything costs. These docs are for the people who call models, the administrators who run
          the gateway, and the operators who host it.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/docs/getting-started"
            className="rounded-control bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-contrast shadow-brand-1 hover:bg-brand-primary-hover"
          >
            Get started
          </Link>
          <Link
            href="/docs/using/calling-the-api"
            className="rounded-control border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium hover:bg-fd-accent"
          >
            Call the API
          </Link>
          <a
            href={productRepo}
            className="rounded-control border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium hover:bg-fd-accent"
          >
            Source on GitHub
          </a>
        </div>
      </div>

      <h2 className="sr-only">Sections</h2>
      <Cards className="mt-12">
        {sections.map((s) => (
          <Card key={s.href} title={s.title} href={s.href} icon={s.icon}>
            {s.description}
          </Card>
        ))}
      </Cards>

      <p className="mt-12 text-sm text-fd-muted-foreground">
        Open Model Gateway is pre-1.0 development software. These docs describe {productVersion}
        {productUnreleased ? ', the next release, as it stands on the main branch' : ''}. More about
        the project is on{' '}
        <a className="text-brand-link underline" href={productSite}>
          its website
        </a>
        ; the engineering notes stay in the{' '}
        <a className="text-brand-link underline" href={productRepo}>
          repository
        </a>
        .
      </p>
    </div>
  );
}
