import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label": string;
  children: ReactNode;
};

export function IconButton({
  children,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-grid size-12 place-items-center rounded-sm border border-[var(--border)] bg-[var(--surface)] transition-[background-color,border-color,transform] duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)] active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
