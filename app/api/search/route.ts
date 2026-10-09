import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Exported as a static file (out/api/search): the search index, searched in the browser.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  language: 'english',
});
