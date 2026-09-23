import { z } from "zod";

const databaseTimestampSchema = z
  .union([z.string().min(1), z.date()])
  .transform((value, context) => {
    const date =
      typeof value === "string" ? new Date(value) : new Date(value.getTime());

    if (Number.isNaN(date.getTime())) {
      context.addIssue({
        code: "custom",
        message: "Expected a valid database timestamp.",
      });
      return z.NEVER;
    }

    return date.toISOString();
  });

const databaseDateSchema = z
  .union([z.string().min(1), z.date()])
  .transform((value, context) => {
    const date =
      typeof value === "string"
        ? new Date(`${value}T00:00:00Z`)
        : new Date(value.getTime());

    if (Number.isNaN(date.getTime())) {
      context.addIssue({
        code: "custom",
        message: "Expected a valid database date.",
      });
      return z.NEVER;
    }

    return date.toISOString().slice(0, 10);
  });

export const insightSourceSchema = z.object({
  publisher: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
});

export const publishedInsightSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  categorySlug: z.string().min(1),
  author: z.string().min(1),
  authorSlug: z.string().min(1),
  image: z.string().min(1),
  imageAlt: z.string(),
  readingTime: z.string().min(1),
  featured: z.boolean(),
  serviceSlugs: z.array(z.string().min(1)),
  relatedInsightSlugs: z.array(z.string().min(1)),
  publishedAt: databaseTimestampSchema,
  updatedAt: databaseTimestampSchema,
  isPlaceholder: z.literal(false),
  isPublished: z.literal(true),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  ogImage: z.string().min(1),
});

export const publishedInsightArticleSchema = publishedInsightSchema.extend({
  quickAnswer: z.string().min(1),
  bodyMarkdown: z.string().min(1),
  sources: z.array(insightSourceSchema),
  sourcesReviewedAt: databaseDateSchema.nullable(),
});

export const publishedInsightCategorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  introduction: z.string().min(1),
  articleCount: z.coerce.number().int().nonnegative(),
  isPublished: z.literal(true),
});

export const publishedInsightAuthorSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  biography: z.string().min(1),
  shortBiography: z.string().min(1),
  image: z.string().min(1),
  imageAlt: z.string(),
  bioApprovalStatus: z.literal("approved"),
  portraitApprovalStatus: z.enum(["approved", "development-only"]),
  articleCount: z.coerce.number().int().nonnegative(),
  isPublished: z.literal(true),
});

export type InsightSource = z.infer<typeof insightSourceSchema>;
export type PublishedInsight = z.infer<typeof publishedInsightSchema>;
export type PublishedInsightArticle = z.infer<
  typeof publishedInsightArticleSchema
>;
export type PublishedInsightCategory = z.infer<
  typeof publishedInsightCategorySchema
>;
export type PublishedInsightAuthor = z.infer<
  typeof publishedInsightAuthorSchema
>;
