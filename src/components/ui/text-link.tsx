import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type TextLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children"
> & {
  children: ReactNode;
  href: string;
};

export function TextLink({
  children,
  className,
  href,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex min-h-11 max-w-full min-w-0 items-center gap-2 border-b border-current/30 text-sm leading-5 font-semibold transition-colors hover:border-current",
        className,
      )}
      href={href}
      prefetch={false}
      {...props}
    >
      <span className="min-w-0 text-balance">{children}</span>
      <ArrowUpRightIcon className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
