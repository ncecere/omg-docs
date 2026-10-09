import { loader } from 'fumadocs-core/source';
import type * as PageTree from 'fumadocs-core/page-tree';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { docsRoute } from './site';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader(
  {
    docs: docs.toFumadocsSource(),
  },
  {
    baseUrl: docsRoute,
  },
);

/**
 * The sidebar's tree, lighter: descriptions aren't shown in the sidebar, so
 * they are left out of every page's payload.
 */
export function sidebarTree(): PageTree.Root {
  const strip = <N extends PageTree.Node>(node: N): N => {
    if (node.type === 'page') {
      const { description: _description, ...rest } = node;
      return rest as N;
    }
    if (node.type === 'folder') {
      return {
        ...node,
        description: undefined,
        index: node.index ? strip(node.index) : undefined,
        children: node.children.map((c) => strip(c)),
      } as N;
    }
    return node;
  };
  const tree = source.getPageTree();
  return { ...tree, children: tree.children.map((c) => strip(c)) };
}
