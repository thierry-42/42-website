import Link from "next/link";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li
              className="flex items-center gap-2"
              key={`${item.label}-${index}`}
            >
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !isCurrent ? (
                <Link
                  className="rounded-xs hover:text-current"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
