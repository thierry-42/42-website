import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ScrollToTop } from "@/components/motion/scroll-to-top";
import { publicPrimaryNavigation, siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/cn";

import "@/styles/globals.css";

const overusedGrotesk = localFont({
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  src: "../assets/fonts/OverusedGrotesk-VF.woff2",
  variable: "--font-overused-grotesk",
  weight: "300 900",
});

const inter = localFont({
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  src: "../assets/fonts/Inter-VariableFont_opsz,wght.ttf",
  variable: "--font-inter",
  weight: "100 900",
});

const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  applicationName: siteContent.meta.brand,
  title: {
    default: siteContent.meta.defaultTitle,
    template: `%s | ${siteContent.meta.brand}`,
  },
  description: siteContent.meta.defaultDescription,
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  category: "business",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#F7F5EF", media: "(prefers-color-scheme: light)" },
    { color: "#090B10", media: "(prefers-color-scheme: dark)" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const consultationHref =
    siteConfig.bookingUrl ?? siteContent.navigation.cta.href;
  const serviceNavigation = siteContent.services.map((service) => ({
    description: service.serviceLine,
    href: `/services/${service.slug}`,
    label: service.shortName,
    slug: service.slug,
  }));

  return (
    <html data-scroll-behavior="smooth" lang="en-GB">
      <body
        className={cn(
          overusedGrotesk.variable,
          inter.variable,
          geistMono.variable,
        )}
      >
        <a
          className="sr-only-focusable fixed top-3 left-3 z-[100] rounded-sm bg-signal-400 px-4 py-3 text-sm font-semibold text-signal-900"
          href="#main-content"
        >
          Skip to main content
        </a>
        <SiteHeader
          consultationHref={consultationHref}
          consultationLabel={siteContent.navigation.cta.label}
          navigation={publicPrimaryNavigation}
          services={serviceNavigation}
        />
        <ScrollProgress />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <ScrollToTop />
        <CustomCursor />
      </body>
    </html>
  );
}
