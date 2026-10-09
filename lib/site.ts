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
export const productVersion = 'v0.3.1';

/** Whether that release is still unreleased (the docs then describe current `main`). */
export const productUnreleased = false;

export const appName = 'Open Model Gateway docs';
export const docsRoute = '/docs';

export const docsRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function editUrl(path: string): string {
  return `${docsRepoUrl}/blob/${gitConfig.branch}/${path}`;
}
