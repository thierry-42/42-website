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
  bioApprovalStatus: z.enum(["approved", "owner-review-required"]),
  specialismsApprovalStatus: z.enum(["approved", "owner-review-required"]),
  portraitApprovalStatus: z.enum(["approved", "development-only"]),
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
  categorySlug: z.string(),
  author: z.string(),
  authorSlug: z.string(),
  image: z.string().min(1),
  imageAlt: z.string(),
  readingTime: z.string().min(1),
  featured: z.boolean(),
  serviceSlugs: z.array(z.string()),
  relatedInsightSlugs: z.array(z.string()),
  publishedAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  isPlaceholder: z.boolean(),
  isPublished: z.boolean(),
});

const insightCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  introduction: z.string(),
  isPublished: z.boolean(),
});

const authorSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  biography: z.string(),
  shortBiography: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  bioApprovalStatus: z.enum(["approved", "owner-review-required"]),
  portraitApprovalStatus: z.enum(["approved", "development-only"]),
  isPublished: z.boolean(),
});

export const siteContentSchema = z.object({
  meta: z.object({
    brand: z.string(),
    tradingName: z.string(),
    descriptor: z.string(),
    tagline: z.string(),
    defaultTitle: z.string(),
    defaultDescription: z.string(),
    siteUrl: z.string(),
    bookingUrl: z.string(),
    contactEmail: z.string(),
    linkedinUrl: z.string(),
    primaryAudience: z.string(),
    serviceAreas: z.array(z.string()),
    lastReviewedAt: z.string().nullable(),
  }),
  brand: z.object({
    positioning: z.string(),
    promise: z.string(),
    principles: z.array(z.string()),
    voice: z.array(z.string()),
  }),
  features: z.object({
    audience: z.boolean(),
    industries: z.boolean(),
    work: z.boolean(),
  }),
  legal: z.object({
    legalEntity: z.string(),
    entityType: z.string(),
    countryOfRegistration: z.string(),
    stateOfRegistration: z.string(),
    governingLaw: z.string(),
    operatorStatement: z.string(),
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
  insightCategories: z.array(insightCategorySchema),
  authors: z.array(authorSchema),
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
export type InsightCategory = z.infer<typeof insightCategorySchema>;
export type Author = z.infer<typeof authorSchema>;

export const siteContent = siteContentSchema.parse(rawSiteContent);

/** Only this projection should feed public proof, people, or publication lists. */
export const publicContent = {
  services: publicRecords(siteContent.services),
  team: publicRecords(siteContent.team),
  caseStudies: publicRecords(siteContent.caseStudies),
  insights: publicRecords(siteContent.insights),
} as const;

const publicationByRoute = {
  "/audience": siteContent.features.audience,
  "/industries": siteContent.features.industries,
  "/work": siteContent.features.work,
} as const;

export function isRoutePublished(href: string): boolean {
  return publicationByRoute[href as keyof typeof publicationByRoute] ?? true;
}

/** Navigation filtered by explicit publication flags while retaining source records. */
export const publicPrimaryNavigation = siteContent.navigation.primary.filter(
  (item) => isRoutePublished(item.href),
);
export const publicFooterNavigation = siteContent.navigation.footer.filter(
  (item) => isRoutePublished(item.href),
);
export const publicInsightCategories = siteContent.insightCategories.filter(
  (category) =>
    category.isPublished &&
    publicContent.insights.some(
      (insight) => insight.categorySlug === category.slug,
    ),
);
export const publicAuthors = siteContent.authors.filter(
  (author) =>
    author.isPublished &&
    publicContent.insights.some(
      (insight) => insight.authorSlug === author.slug,
    ),
);

export function getPublishedService(slug: string): Service | undefined {
  return publicContent.services.find((service) => service.slug === slug);
}

export function getPublishedCaseStudy(slug: string): CaseStudy | undefined {
  return publicContent.caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getPublishedInsight(slug: string): Insight | undefined {
  return publicContent.insights.find((insight) => insight.slug === slug);
}

export function getPublishedInsightCategory(
  slug: string,
): InsightCategory | undefined {
  return publicInsightCategories.find((category) => category.slug === slug);
}

export function getAuthor(slug: string): Author | undefined {
  return siteContent.authors.find((author) => author.slug === slug);
}

export function getPublishedAuthor(slug: string): Author | undefined {
  return publicAuthors.find((author) => author.slug === slug);
}
