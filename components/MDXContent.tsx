import { MDXRemote } from "next-mdx-remote/rsc";

/**
 * Renders an MDX string with styled elements that match the site's minimal
 * design language (no @tailwindcss/typography dependency needed).
 */
const components = {
  h2: (props: any) => (
    <h2 className="mt-10 mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  p: (props: any) => (
    <p className="my-4 leading-7 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ul: (props: any) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ol: (props: any) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300" {...props} />
  ),
  li: (props: any) => <li className="leading-7" {...props} />,
  a: (props: any) => (
    <a className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="my-6 border-l-4 border-blue-500/60 pl-4 italic text-gray-600 dark:text-gray-400" {...props} />
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
};

export default function MDXContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
