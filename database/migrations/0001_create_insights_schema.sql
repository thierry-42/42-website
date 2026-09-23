CREATE TABLE authors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  biography TEXT NOT NULL,
  short_biography TEXT NOT NULL,
  image_path TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  bio_approval_status TEXT NOT NULL DEFAULT 'owner-review-required'
    CHECK (bio_approval_status IN ('approved', 'owner-review-required')),
  portrait_approval_status TEXT NOT NULL DEFAULT 'development-only'
    CHECK (portrait_approval_status IN ('approved', 'development-only')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insight_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  introduction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  quick_answer TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  author_id BIGINT NOT NULL REFERENCES authors (id) ON DELETE RESTRICT,
  category_id BIGINT NOT NULL REFERENCES insight_categories (id) ON DELETE RESTRICT,
  image_path TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  og_image_path TEXT,
  reading_time_minutes INTEGER NOT NULL CHECK (reading_time_minutes > 0),
  seo_title TEXT,
  seo_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_placeholder BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  sources_reviewed_at DATE,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT published_articles_require_a_date
    CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT published_articles_are_not_placeholders
    CHECK (status <> 'published' OR is_placeholder = FALSE)
);

CREATE TABLE article_sources (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  publisher TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
  CONSTRAINT article_sources_unique_order UNIQUE (article_id, sort_order),
  CONSTRAINT article_sources_unique_url UNIQUE (article_id, url)
);

CREATE TABLE article_services (
  article_id BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
  PRIMARY KEY (article_id, service_slug),
  CONSTRAINT article_services_unique_order UNIQUE (article_id, sort_order)
);

CREATE TABLE article_relations (
  article_id BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  related_article_id BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL CHECK (sort_order >= 0),
  PRIMARY KEY (article_id, related_article_id),
  CONSTRAINT article_relations_unique_order UNIQUE (article_id, sort_order),
  CONSTRAINT article_relations_not_self
    CHECK (article_id <> related_article_id)
);

CREATE INDEX articles_publication_order_idx
  ON articles (status, published_at DESC, display_order, id);
CREATE INDEX articles_category_order_idx
  ON articles (category_id, status, display_order, published_at DESC, id);
CREATE INDEX articles_author_order_idx
  ON articles (author_id, status, display_order, published_at DESC, id);
CREATE INDEX articles_featured_order_idx
  ON articles (featured, status, display_order, published_at DESC, id);
CREATE INDEX article_relations_reverse_idx
  ON article_relations (related_article_id, article_id);
