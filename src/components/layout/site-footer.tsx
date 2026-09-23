import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import {
  publicFooterNavigation,
  publicPrimaryNavigation,
  siteContent,
} from "@/content/site-content";
import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  const contactLinks = [
    siteConfig.contactEmail
      ? { href: `mailto:${siteConfig.contactEmail}`, label: "Email" }
      : null,
    siteConfig.linkedinUrl
      ? { href: siteConfig.linkedinUrl, label: "LinkedIn" }
      : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  return (
    <footer
      className="border-t border-[var(--colour-border-inverse)] bg-[var(--colour-surface-inverse)] py-16 text-[var(--colour-text-inverse)]"
      data-cursor-color="light"
      data-surface="dark"
      data-testid="site-footer"
    >
      <Container>
        <div className="grid min-w-0 gap-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <Logo inverse />
            <p className="mt-7 max-w-[18ch] text-3xl leading-tight font-semibold tracking-[-0.045em] text-balance">
              {siteContent.meta.tagline}
            </p>
            <p className="mt-5 max-w-[46ch] text-sm leading-6 text-[var(--colour-text-inverse-muted)]">
              Senior-led strategy and hands-on technical delivery for HubSpot
              systems that need to work clearly.
            </p>
          </div>

          <div className="grid min-w-0 gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterGroup label="Navigate">
              {publicPrimaryNavigation.map((item) => (
                <FooterLink href={item.href} key={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterGroup>
            <FooterGroup label="Services">
              {siteContent.services.slice(0, 5).map((service) => (
                <FooterLink
                  href={`/services/${service.slug}`}
                  key={service.slug}
                >
                  {service.shortName}
                </FooterLink>
              ))}
            </FooterGroup>
            <FooterGroup label="Utility">
              {publicFooterNavigation.map((item) => (
                <FooterLink href={item.href} key={item.href}>
                  {item.label}
                </FooterLink>
              ))}
              {siteConfig.visualPreferencesEnabled ? (
                <FooterLink href="/accessibility">Accessibility</FooterLink>
              ) : null}
              {contactLinks.map((item) => (
                <FooterLink href={item.href} key={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterGroup>
          </div>
        </div>

        <div className="mt-16 flex min-w-0 flex-col gap-x-6 gap-y-3 border-t border-[var(--colour-border-inverse)] pt-6 font-mono text-[0.6875rem] tracking-[0.06em] text-[var(--colour-text-inverse-muted)] uppercase sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 42. All rights reserved.</p>
          <p>Built with clarity and an unreasonable dislike of messy CRMs.</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="min-w-0">
      <h2 className="font-mono text-[0.6875rem] tracking-[0.14em] text-[var(--colour-text-inverse-muted)] uppercase">
        {label}
      </h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <li>
      <Link
        className="inline-block max-w-full py-1 text-sm text-pretty [overflow-wrap:anywhere] text-[var(--colour-text-inverse-muted)] hover:text-[var(--colour-text-inverse)]"
        href={href}
        prefetch={false}
      >
        {children}
      </Link>
    </li>
  );
}
