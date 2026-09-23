import "server-only";

import { unstable_cache } from "next/cache";
import { z } from "zod";

import { queryDatabase } from "@/lib/database/pool";
import {
  publishedInsightArticleSchema,
  publishedInsightAuthorSchema,
  publishedInsightCategorySchema,
  publishedInsightSchema,
  type PublishedInsight,
  type PublishedInsightArticle,
  type PublishedInsightAuthor,
  type PublishedInsightCategory,
} from "@/lib/insights/models";

export const INSIGHTS_REVALIDATE_SECONDS = 300;
export const INSIGHTS_CACHE_TAG = "insights";

const publicationCutoff = () => new Date().toISOString();

const publicArticlePredicate = (cutoffParameter: string) => `
  article.status = 'published'
  AND article.is_placeholder = FALSE
  AND article.published_at IS NOT NULL
  AND article.published_at <= ${cutoffParameter}::TIMESTAMPTZ
  AND category.status = 'published'
  AND author.status = 'published'
  AND author.bio_approval_status = 'approved'
`;

const publicRelatedArticlePredicate = (cutoffParameter: string) => `
  related.status = 'published'
  AND related.is_placeholder = FALSE
  AND related.published_at IS NOT NULL
  AND related.published_at <= ${cutoffParameter}::TIMESTAMPTZ
  AND related_category.status = 'published'
  AND related_author.status = 'published'
  AND related_author.bio_approval_status = 'approved'
`;

const insightColumns = `
  article.slug,
  article.title,
  article.summary,
  category.name AS "category",
  category.slug AS "categorySlug",
  author.name AS "author",
  author.slug AS "authorSlug",
  article.image_path AS "image",
  article.image_alt AS "imageAlt",
  article.reading_time_minutes::TEXT || ' min read' AS "readingTime",
  article.featured,
  COALESCE(service_links.service_slugs, ARRAY[]::TEXT[]) AS "serviceSlugs",
  COALESCE(relation_links.related_slugs, ARRAY[]::TEXT[])
    AS "relatedInsightSlugs",
  article.published_at AS "publishedAt",
  article.updated_at AS "updatedAt",
  FALSE AS "isPlaceholder",
  TRUE AS "isPublished",
  CASE
    WHEN article.seo_title IS NULL OR article.seo_title = '' THEN article.title
    ELSE article.seo_title
  END AS "seoTitle",
  CASE
    WHEN article.seo_description IS NULL OR article.seo_description = ''
      THEN article.summary
    ELSE article.seo_description
  END AS "seoDescription",
  CASE
    WHEN article.og_image_path IS NULL OR article.og_image_path = ''
      THEN article.image_path
    ELSE article.og_image_path
  END AS "ogImage"
`;

const insightFrom = (cutoffParameter: string) => `
  FROM articles AS article
  JOIN insight_categories AS category ON category.id = article.category_id
  JOIN authors AS author ON author.id = article.author_id
  LEFT JOIN (
    SELECT
      article_service.article_id,
      ARRAY_AGG(
        article_service.service_slug ORDER BY article_service.sort_order
      ) AS service_slugs
    FROM article_services AS article_service
    GROUP BY article_service.article_id
  ) AS service_links ON service_links.article_id = article.id
  LEFT JOIN (
    SELECT
      relation.article_id,
      ARRAY_AGG(related.slug ORDER BY relation.sort_order) AS related_slugs
    FROM article_relations AS relation
    JOIN articles AS related ON related.id = relation.related_article_id
    JOIN insight_categories AS related_category
      ON related_category.id = related.category_id
    JOIN authors AS related_author ON related_author.id = related.author_id
    WHERE ${publicRelatedArticlePredicate(cutoffParameter)}
    GROUP BY relation.article_id
  ) AS relation_links ON relation_links.article_id = article.id
`;

const insightOrder = `
  ORDER BY article.display_order ASC, article.published_at DESC, article.id ASC
`;

function parseRows<Schema extends z.ZodType>(
  schema: Schema,
  rows: unknown[],
): z.infer<Schema>[] {
  return z.array(schema).parse(rows);
}

async function queryPublishedInsights(
  extraPredicate = "",
  values: readonly unknown[] = [],
): Promise<PublishedInsight[]> {
  const cutoff = publicationCutoff();
  const result = await queryDatabase(
    `
      SELECT ${insightColumns}
      ${insightFrom("$1")}
      WHERE ${publicArticlePredicate("$1")}
      ${extraPredicate}
      ${insightOrder}
    `,
    [cutoff, ...values],
  );

  return parseRows(publishedInsightSchema, result.rows);
}

const listPublishedInsightsCached = unstable_cache(
  () => queryPublishedInsights(),
  ["insights", "published-list"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:articles"],
  },
);

const getPublishedInsightCached = unstable_cache(
  async (slug: string): Promise<PublishedInsightArticle | undefined> => {
    const result = await queryDatabase(
      `
        SELECT
          ${insightColumns},
          article.quick_answer AS "quickAnswer",
          article.body_markdown AS "bodyMarkdown",
          article.sources_reviewed_at AS "sourcesReviewedAt"
        ${insightFrom("$1")}
        WHERE ${publicArticlePredicate("$1")}
          AND article.slug = $2
        LIMIT 1
      `,
      [publicationCutoff(), slug],
    );

    const row = result.rows[0];
    if (!row) return undefined;

    const sourcesResult = await queryDatabase(
      `
        SELECT source.publisher, source.title, source.url
        FROM article_sources AS source
        JOIN articles AS article ON article.id = source.article_id
        WHERE article.slug = $1
        ORDER BY source.sort_order
      `,
      [slug],
    );

    return publishedInsightArticleSchema.parse({
      ...row,
      sources: sourcesResult.rows,
    });
  },
  ["insights", "published-article-by-slug"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:articles"],
  },
);

const getPublishedInsightSummaryCached = unstable_cache(
  async (slug: string): Promise<PublishedInsight | undefined> => {
    const insights = await queryPublishedInsights("AND article.slug = $2", [
      slug,
    ]);
    return insights[0];
  },
  ["insights", "published-summary-by-slug"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:articles"],
  },
);

const listPublishedInsightsByCategoryCached = unstable_cache(
  (categorySlug: string) =>
    queryPublishedInsights("AND category.slug = $2", [categorySlug]),
  ["insights", "published-list-by-category"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:articles", "insights:categories"],
  },
);

const listPublishedInsightsByAuthorCached = unstable_cache(
  (authorSlug: string) =>
    queryPublishedInsights("AND author.slug = $2", [authorSlug]),
  ["insights", "published-list-by-author"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:articles", "insights:authors"],
  },
);

const listPublishedInsightsByServiceCached = unstable_cache(
  (serviceSlug: string) =>
    queryPublishedInsights(
      `
        AND article.id IN (
          SELECT linked_service.article_id
          FROM article_services AS linked_service
          WHERE linked_service.service_slug = $2
        )
      `,
      [serviceSlug],
    ),
  ["insights", "published-list-by-service"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:articles", "insights:services"],
  },
);

const listPublishedInsightCategoriesCached = unstable_cache(
  async (): Promise<PublishedInsightCategory[]> => {
    const result = await queryDatabase(
      `
        SELECT
          category.slug,
          category.name,
          category.introduction,
          COUNT(article.id)::INTEGER AS "articleCount",
          TRUE AS "isPublished"
        FROM insight_categories AS category
        JOIN articles AS article ON article.category_id = category.id
        JOIN authors AS author ON author.id = article.author_id
        WHERE ${publicArticlePredicate("$1")}
        GROUP BY
          category.id,
          category.slug,
          category.name,
          category.introduction,
          category.display_order
        ORDER BY category.display_order ASC, category.name ASC
      `,
      [publicationCutoff()],
    );

    return parseRows(publishedInsightCategorySchema, result.rows);
  },
  ["insights", "published-category-list"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:categories"],
  },
);

const getPublishedInsightCategoryCached = unstable_cache(
  async (slug: string): Promise<PublishedInsightCategory | undefined> => {
    const result = await queryDatabase(
      `
        SELECT
          category.slug,
          category.name,
          category.introduction,
          COUNT(article.id)::INTEGER AS "articleCount",
          TRUE AS "isPublished"
        FROM insight_categories AS category
        JOIN articles AS article ON article.category_id = category.id
        JOIN authors AS author ON author.id = article.author_id
        WHERE ${publicArticlePredicate("$1")}
          AND category.slug = $2
        GROUP BY
          category.id,
          category.slug,
          category.name,
          category.introduction,
          category.display_order
        LIMIT 1
      `,
      [publicationCutoff(), slug],
    );

    const row = result.rows[0];
    return row ? publishedInsightCategorySchema.parse(row) : undefined;
  },
  ["insights", "published-category-by-slug"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:categories"],
  },
);

const authorColumns = `
  author.slug,
  author.name,
  author.role,
  author.biography,
  author.short_biography AS "shortBiography",
  author.image_path AS "image",
  author.image_alt AS "imageAlt",
  author.bio_approval_status AS "bioApprovalStatus",
  author.portrait_approval_status AS "portraitApprovalStatus",
  COUNT(article.id)::INTEGER AS "articleCount",
  TRUE AS "isPublished"
`;

const publicAuthorFrom = `
  FROM authors AS author
  JOIN articles AS article ON article.author_id = author.id
  JOIN insight_categories AS category ON category.id = article.category_id
`;

const listPublishedInsightAuthorsCached = unstable_cache(
  async (): Promise<PublishedInsightAuthor[]> => {
    const result = await queryDatabase(
      `
        SELECT ${authorColumns}
        ${publicAuthorFrom}
        WHERE ${publicArticlePredicate("$1")}
        GROUP BY
          author.id,
          author.slug,
          author.name,
          author.role,
          author.biography,
          author.short_biography,
          author.image_path,
          author.image_alt,
          author.bio_approval_status,
          author.portrait_approval_status,
          author.display_order
        ORDER BY author.display_order ASC, author.name ASC
      `,
      [publicationCutoff()],
    );

    return parseRows(publishedInsightAuthorSchema, result.rows);
  },
  ["insights", "published-author-list"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:authors"],
  },
);

const getPublishedInsightAuthorCached = unstable_cache(
  async (slug: string): Promise<PublishedInsightAuthor | undefined> => {
    const result = await queryDatabase(
      `
        SELECT ${authorColumns}
        ${publicAuthorFrom}
        WHERE ${publicArticlePredicate("$1")}
          AND author.slug = $2
        GROUP BY
          author.id,
          author.slug,
          author.name,
          author.role,
          author.biography,
          author.short_biography,
          author.image_path,
          author.image_alt,
          author.bio_approval_status,
          author.portrait_approval_status,
          author.display_order
        LIMIT 1
      `,
      [publicationCutoff(), slug],
    );

    const row = result.rows[0];
    return row ? publishedInsightAuthorSchema.parse(row) : undefined;
  },
  ["insights", "published-author-by-slug"],
  {
    revalidate: INSIGHTS_REVALIDATE_SECONDS,
    tags: [INSIGHTS_CACHE_TAG, "insights:authors"],
  },
);

export function listPublishedInsights(): Promise<PublishedInsight[]> {
  return listPublishedInsightsCached();
}

export function getPublishedInsight(
  slug: string,
): Promise<PublishedInsightArticle | undefined> {
  return getPublishedInsightCached(slug);
}

export function getPublishedInsightSummary(
  slug: string,
): Promise<PublishedInsight | undefined> {
  return getPublishedInsightSummaryCached(slug);
}

export async function getPublishedInsightsBySlugs(
  slugs: readonly string[],
): Promise<PublishedInsight[]> {
  const insights = await Promise.all(
    slugs.map((slug) => getPublishedInsightSummaryCached(slug)),
  );
  return insights.filter((insight) => insight !== undefined);
}

export function listPublishedInsightsByCategory(
  categorySlug: string,
): Promise<PublishedInsight[]> {
  return listPublishedInsightsByCategoryCached(categorySlug);
}

export function listPublishedInsightsByAuthor(
  authorSlug: string,
): Promise<PublishedInsight[]> {
  return listPublishedInsightsByAuthorCached(authorSlug);
}

export function listPublishedInsightsByService(
  serviceSlug: string,
): Promise<PublishedInsight[]> {
  return listPublishedInsightsByServiceCached(serviceSlug);
}

export function listPublishedInsightCategories(): Promise<
  PublishedInsightCategory[]
> {
  return listPublishedInsightCategoriesCached();
}

export function getPublishedInsightCategory(
  slug: string,
): Promise<PublishedInsightCategory | undefined> {
  return getPublishedInsightCategoryCached(slug);
}

export function listPublishedInsightAuthors(): Promise<
  PublishedInsightAuthor[]
> {
  return listPublishedInsightAuthorsCached();
}

export function getPublishedInsightAuthor(
  slug: string,
): Promise<PublishedInsightAuthor | undefined> {
  return getPublishedInsightAuthorCached(slug);
}
