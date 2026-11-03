/*
 * The site's addresses, repositories and the release it describes, in one
 * place so they are easy to change. Everything else imports from here.
 */

/** The published docs. Used for absolute URLs (Open Graph, metadata). */
export const siteUrl = 'https://docs.omg.bitop.dev';

/** The product's own website. */
export const productSite = 'https://omg.bitop.dev';

/** The docs' own repository: "Edit on GitHub" links point here. */
export const gitConfig = {
  user: 'ncecere',
  repo: 'omg-docs',
  branch: 'main',
};

/** The product's repository. */
export const productRepo = 'https://github.com/ncecere/open-model-gateway';

/** The Open Model Gateway release these docs describe. */
export const productVersion = 'v0.10.0';

/** The date that release was tagged (YYYY-MM-DD). */
export const productReleaseDate = '2026-11-02';

/**
 * That release's container image digest (the multi-arch index), verified against the
 * GitHub release's digest asset and the registry. Deploy as
 * `ghcr.io/ncecere/open-model-gateway:<productVersion>@<productImageDigest>`.
 */
export const productImageDigest =
  'sha256:77a37910d5af8ef26cdacec1f7dac026ba2aee32d9de8fd8ab30c039adbcdbe6';

/** Whether that release is still unreleased (the docs then describe current `main`). */
export const productUnreleased = false;

export const appName = 'Open Model Gateway docs';
export const docsRoute = '/docs';

export const docsRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function editUrl(path: string): string {
  return `${docsRepoUrl}/blob/${gitConfig.branch}/${path}`;
}
