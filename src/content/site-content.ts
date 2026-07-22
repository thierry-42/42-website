import { z } from "zod";

import rawSiteContent from "./site-content.json";

import { publicRecords } from "@/lib/proof";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const callToActionSchema = linkSchema;

const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    primaryCta: callToActionSchema,
    secondaryCta: callToActionSchema,
  }),
  problem: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    items: z.array(z.string()),
    closing: z.string(),
  }),
  difference: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    items: z.array(z.string()),
  }),
  process: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    steps: z.array(
      z.object({
        number: z.string(),
        title: z.string(),
        body: z.string(),
      }),
    ),
  }),
  integration: z.object({
    headline: z.string(),
    body: z.string(),
    capabilities: z.array(z.string()),
  }),
  booking: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    primaryCta: callToActionSchema,
    secondaryCta: callToActionSchema,
  }),
});

const serviceSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  image: z.string().min(1),
  headline: z.string().min(1),
  summary: z.string().min(1),
  serviceLine: z.string().min(1),
  capabilities: z.array(z.string()),
  related: z.array(z.string()),
  isPublished: z.boolean(),
});

const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  specialisms: z.array(z.string()),
  image: z.string(),
  imageAlt: z.string(),
  imageIsPlaceholder: z.boolean(),
  linkedinUrl: z.string(),
  relationship: z.string(),
  isPlaceholder: z.boolean(),
  isPublished: z.boolean(),
});

const caseStudySchema = z.object({
  slug: z.string(),
  client: z.string(),
  sector: z.string(),
  summary: z.string(),
  challenge: z.string(),
  solution: z.string(),
  outcomes: z.array(z.string()),
  services: z.array(z.string()),
  image: z.string(),
  isPlaceholder: z.boolean(),
  isVerified: z.boolean(),
  isPublished: z.boolean(),
  approvalStatus: z.string(),
});

const insightSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  category: z.string(),
  author: z.string(),
  image: z.string().min(1),
  imageAlt: z.string(),
  readingTime: z.string().min(1),
  featured: z.boolean(),
  serviceSlugs: z.array(z.string()),
  publishedAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  isPlaceholder: z.boolean(),
  isPublished: z.boolean(),
});

export const siteContentSchema = z.object({
  meta: z.object({
    brand: z.string(),
    descriptor: z.string(),
    tagline: z.string(),
    defaultTitle: z.string(),
    defaultDescription: z.string(),
    siteUrl: z.string(),
    bookingUrl: z.string(),
    contactEmail: z.string(),
    linkedinUrl: z.string(),
    lastReviewedAt: z.string().nullable(),
  }),
  brand: z.object({
    positioning: z.string(),
    promise: z.string(),
    principles: z.array(z.string()),
    voice: z.array(z.string()),
  }),
  navigation: z.object({
    primary: z.array(linkSchema),
    cta: callToActionSchema,
    footer: z.array(linkSchema),
  }),
  home: homeSchema,
  engagements: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      items: z.array(z.string()),
    }),
  ),
  services: z.array(serviceSchema),
  team: z.array(teamMemberSchema),
  caseStudies: z.array(caseStudySchema),
  insights: z.array(insightSchema),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  proofGovernance: z.object({
    renderUnverifiedProof: z.literal(false),
    requiredFields: z.array(z.string()),
    neverInvent: z.array(z.string()),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Insight = z.infer<typeof insightSchema>;

export const siteContent = siteContentSchema.parse(rawSiteContent);

/** Only this projection should feed public proof, people, or publication lists. */
export const publicContent = {
  services: publicRecords(siteContent.services),
  team: publicRecords(siteContent.team),
  caseStudies: publicRecords(siteContent.caseStudies),
  insights: publicRecords(siteContent.insights),
} as const;

export function getPublishedService(slug: string): Service | undefined {
  return publicContent.services.find((service) => service.slug === slug);
}

export function getPublishedCaseStudy(slug: string): CaseStudy | undefined {
  return publicContent.caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getPublishedInsight(slug: string): Insight | undefined {
  return publicContent.insights.find((insight) => insight.slug === slug);
}
