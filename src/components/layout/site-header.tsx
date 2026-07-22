"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { cn } from "@/lib/cn";

type NavItem = {
  href: string;
  label: string;
};

type ServiceNavItem = NavItem & {
  description: string;
  slug: string;
};

type SiteHeaderProps = {
  consultationHref: string;
  consultationLabel: string;
  navigation: NavItem[];
  services: ServiceNavItem[];
};

export function SiteHeader({
  consultationHref,
  consultationLabel,
  navigation,
  services,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const servicesMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 16);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isServicesOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !servicesMenuRef.current?.contains(target)) {
        setIsServicesOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsServicesOpen(false);
        servicesMenuRef.current?.querySelector("summary")?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isServicesOpen]);

  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[var(--header-height)] border-b border-white/10 bg-ink-950 text-paper-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200",
        isScrolled &&
          "bg-ink-950/94 shadow-[0_0.5rem_2rem_rgb(9_11_16/0.16)] backdrop-blur-md",
      )}
      data-testid="site-header"
    >
      <div className="mx-auto flex h-full max-w-[var(--container-wide)] items-center justify-between gap-6 px-[var(--gutter)]">
        <Logo inverse />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navigation.map((item) => {
            if (item.href === "/services") {
              return (
                <details
                  className="group relative"
                  key={item.href}
                  open={isServicesOpen}
                  ref={servicesMenuRef}
                >
                  <summary
                    aria-current={servicesActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 cursor-pointer list-none items-center rounded-sm px-3 text-sm font-semibold marker:hidden hover:bg-current/8",
                      servicesActive &&
                        "underline decoration-2 underline-offset-8",
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      setIsServicesOpen((current) => !current);
                    }}
                  >
                    {item.label}
                  </summary>
                  <div
                    className="fixed top-[calc(var(--header-height)+0.75rem)] left-1/2 w-[min(52rem,calc(100vw-(2*var(--gutter))))] -translate-x-1/2 rounded-lg border border-ink-950/10 bg-paper-50 p-3 text-ink-950 shadow-lift"
                    data-testid="services-menu"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {services.map((service, index) => (
                        <Link
                          className="group/item grid grid-cols-[2.5rem_1fr] gap-3 rounded-md p-4 transition-colors hover:bg-paper-100"
                          href={service.href}
                          key={service.href}
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <span className="grid size-10 place-items-center rounded-sm border border-ink-950/10 text-ink-950 transition-colors group-hover/item:border-signal-500 group-hover/item:bg-signal-400 group-hover/item:text-signal-900 group-hover/item:[&_circle.text-signal-400]:text-ink-950">
                            <SystemIcon
                              className="size-7"
                              name={service.slug as SystemIconName}
                            />
                          </span>
                          <span>
                            <span className="flex items-center gap-2 font-mono text-[0.625rem] text-slate-500">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="mt-1 block text-sm font-semibold">
                              {service.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-slate-500">
                              {service.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      className="mt-2 flex min-h-11 items-center justify-between rounded-md bg-ink-950 px-4 text-sm font-semibold text-paper-50"
                      href="/services"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      View all services <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </details>
              );
            }

            const active = pathname === item.href;
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-sm px-3 text-sm font-semibold hover:bg-current/8",
                  active && "underline decoration-2 underline-offset-8",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href={consultationHref} showArrow>
            {consultationLabel}
          </Button>
        </div>

        <IconButton
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          className={cn(
            "lg:hidden",
            "border-white/25 bg-white/5 text-paper-50 hover:bg-white/10",
          )}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? (
            <CloseIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </IconButton>
      </div>

      <div
        aria-hidden={!isMenuOpen}
        className={cn(
          "absolute inset-x-0 top-full h-[calc(100dvh-var(--header-height))] overflow-y-auto bg-ink-950 text-paper-50 transition-[opacity,visibility,transform] duration-200 lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        )}
        id="mobile-navigation"
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex min-h-full max-w-[var(--container-wide)] flex-col px-[var(--gutter)] py-10"
        >
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {navigation.map((item, index) => (
              <li key={item.href}>
                <Link
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-16 items-center justify-between py-3 text-xl font-semibold tracking-[-0.03em]"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {item.label}
                  <span className="font-mono text-xs text-white/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <Button
              className="w-full"
              href={consultationHref}
              onClick={() => setIsMenuOpen(false)}
              showArrow
              tabIndex={isMenuOpen ? 0 : -1}
            >
              {consultationLabel}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
