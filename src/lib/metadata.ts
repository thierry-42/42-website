import type { Metadata } from "next";

import { siteContent } from "@/content/site-content";
import { isSearchIndexable, siteConfig } from "@/lib/config";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/images/og/42-hubspot-consultancy.webp",
  imageAlt = "42, a senior-led HubSpot consultancy",
}: PageMetadataInput): Metadata {
  const canonical = new URL(path, siteConfig.siteUrl).toString();
  const socialImage = new URL(image, siteConfig.siteUrl).toString();

  if (!isSearchIndexable) {
    return {
      description,
      title,
    };
  }

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      description,
      images: [
        {
          alt: imageAlt,
          height: 630,
          url: socialImage,
          width: 1200,
        },
      ],
      locale: "en_GB",
      siteName: siteContent.meta.brand,
      title,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: [socialImage],
      title,
    },
  };
}
