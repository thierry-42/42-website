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
      className="border-t border-white/12 bg-ink-950 py-16 text-paper-50"
      data-surface="dark"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo inverse />
            <p className="mt-7 max-w-[18ch] text-3xl leading-tight font-semibold tracking-[-0.045em]">
              {siteContent.meta.tagline}
            </p>
            <p className="mt-5 max-w-[46ch] text-sm leading-6 text-white/62">
              Senior-led strategy and hands-on technical delivery for HubSpot
              systems that need to work clearly.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
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
              {contactLinks.map((item) => (
                <FooterLink href={item.href} key={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterGroup>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-6 font-mono text-[0.6875rem] tracking-[0.06em] text-white/55 uppercase sm:flex-row sm:items-center sm:justify-between">
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
    <div>
      <h2 className="font-mono text-[0.6875rem] tracking-[0.14em] text-white/48 uppercase">
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
        className="inline-block py-1 text-sm text-white/78 hover:text-white"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
