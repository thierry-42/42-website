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
        "group inline-flex min-h-11 items-center gap-2 border-b border-current/30 text-sm font-semibold transition-colors hover:border-current",
        className,
      )}
      href={href}
      {...props}
    >
      {children}
      <ArrowUpRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
