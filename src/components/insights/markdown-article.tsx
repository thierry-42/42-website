import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownHeading = {
  depth: 2 | 3;
  id: string;
  title: string;
};

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }

  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    typeof children.props === "object" &&
    children.props &&
    "children" in children.props
  ) {
    return headingText(children.props.children as ReactNode);
  }

  return "";
}

function normaliseHeadingText(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}

function createHeadingIdFactory() {
  const counts = new Map<string, number>();

  return (title: string) => {
    const base =
      title
        .toLocaleLowerCase("en-GB")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}

export function getMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const makeId = createHeadingIdFactory();

  return markdown.split(/\r?\n/).flatMap((line): MarkdownHeading[] => {
    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) return [];

    const title = normaliseHeadingText(match[2]);
    if (!title) return [];

    return [
      {
        depth: match[1].length as 2 | 3,
        id: makeId(title),
        title,
      },
    ];
  });
}

export function MarkdownArticle({ markdown }: { markdown: string }) {
  const makeId = createHeadingIdFactory();

  const components: Components = {
    h1: ({ children }) => {
      const title = headingText(children);
      return (
        <h2
          className="scroll-mt-32 font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.02] tracking-[-0.035em]"
          id={makeId(title)}
        >
          {children}
        </h2>
      );
    },
    h2: ({ children }) => {
      const title = headingText(children);
      return (
        <h2
          className="scroll-mt-32 font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.02] tracking-[-0.035em]"
          id={makeId(title)}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const title = headingText(children);
      return (
        <h3
          className="scroll-mt-32 text-xl leading-snug font-semibold tracking-[-0.035em]"
          id={makeId(title)}
        >
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="text-lg leading-8 text-ink-800">{children}</p>
    ),
    ul: ({ children }) => <ul className="grid gap-3 pl-1">{children}</ul>,
    ol: ({ children }) => (
      <ol className="grid list-decimal gap-3 pl-6">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-base leading-7 text-ink-800 marker:font-mono marker:text-xs">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-signal-500 bg-signal-400/12 px-6 py-5 text-base leading-7 text-ink-800">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => {
      const external =
        href?.startsWith("http://") || href?.startsWith("https://");
      return (
        <a
          className="font-semibold underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-current"
          href={href}
          rel={external ? "noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-[var(--border)] bg-[var(--surface-muted)] p-3 font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-[var(--border)] p-3 align-top">
        {children}
      </td>
    ),
    hr: () => <hr className="border-[var(--border)]" />,
    img: () => null,
  };

  return (
    <div className="space-y-7 [&>h2]:mt-16 [&>h3]:mt-10">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
