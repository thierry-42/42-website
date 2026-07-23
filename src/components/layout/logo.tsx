import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  inverse?: boolean;
};

export function Logo({ className, inverse = false }: LogoProps) {
  return (
    <Link
      aria-label="42 HubSpot consultancy, home"
      className={cn(
        "group inline-flex min-h-11 items-center gap-3 font-sans text-2xl leading-none font-extrabold tracking-[-0.08em]",
        inverse ? "text-paper-50" : "text-ink-950",
        className,
      )}
      href="/"
      prefetch={false}
    >
      <span className="relative inline-grid size-10 place-items-center overflow-hidden rounded-sm border border-current/25">
        <span aria-hidden="true">42</span>
        <span className="absolute inset-x-1 bottom-1 h-0.5 origin-left scale-x-0 bg-signal-400 transition-transform duration-200 group-hover:scale-x-100" />
      </span>
      <span className="hidden text-xs font-semibold tracking-[0.08em] sm:block">
        HUBSPOT CONSULTANCY
      </span>
    </Link>
  );
}
