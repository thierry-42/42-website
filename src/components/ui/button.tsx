import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "quiet";

const baseClasses =
  "group inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border px-5 py-3 text-sm font-semibold transition-[color,background-color,border-color,transform,box-shadow] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-signal-400 bg-signal-400 text-signal-900 hover:border-signal-500 hover:bg-signal-500",
  secondary:
    "border-[var(--border-strong)] bg-transparent text-current hover:border-current hover:bg-[var(--surface-muted)]",
  quiet:
    "border-transparent bg-transparent px-1 text-current hover:text-[var(--text-muted)]",
};

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
  variant?: ButtonVariant;
};

type LinkButtonProps = SharedButtonProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  > & {
    disabled?: boolean;
    href: string;
  };

type NativeButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, className, showArrow = false, variant = "primary" } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);
  const content = (
    <>
      <span>{children}</span>
      {showArrow ? (
        <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    const {
      children: _children,
      className: _className,
      disabled,
      href,
      showArrow: _showArrow,
      variant: _variant,
      ...linkProps
    } = props as LinkButtonProps;

    if (disabled) {
      return (
        <span aria-disabled="true" className={classes}>
          {content}
        </span>
      );
    }

    return (
      <Link className={classes} href={href} prefetch={false} {...linkProps}>
        {content}
      </Link>
    );
  }

  const {
    children: _children,
    className: _className,
    showArrow: _showArrow,
    variant: _variant,
    ...buttonProps
  } = props as NativeButtonProps;
  return (
    <button className={classes} type="button" {...buttonProps}>
      {content}
    </button>
  );
}
