import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Screenshot } from './screenshot';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    Tab,
    Tabs,
    File,
    Files,
    Folder,
    Accordion,
    Accordions,
    Screenshot,
    // Wide tables scroll sideways: make the scroller reachable by keyboard (WCAG 2.1.1).
    table: (props: ComponentProps<'table'>) => (
      <div className="relative my-6 overflow-auto prose-no-margin" tabIndex={0} role="region" aria-label="Table">
        <table {...props} />
      </div>
    ),
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
