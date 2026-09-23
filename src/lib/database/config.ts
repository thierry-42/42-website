import "server-only";

import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalPostgresUrl = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .refine((value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "postgres:" || protocol === "postgresql:";
      } catch {
        return false;
      }
    }, "Expected a PostgreSQL connection URL."),
);

const positiveInteger = (fallback: number, maximum: number) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().max(maximum).default(fallback),
  );

const databaseEnvironmentSchema = z.object({
  DATABASE_URL: optionalPostgresUrl.optional(),
  DATABASE_POOL_MAX: positiveInteger(5, 100),
  DATABASE_CONNECTION_TIMEOUT_MS: positiveInteger(5_000, 120_000),
  DATABASE_IDLE_TIMEOUT_MS: positiveInteger(30_000, 120_000),
  DATABASE_TEST_MODE: z.preprocess(
    emptyToUndefined,
    z.literal("pg-mem").optional(),
  ),
  DATABASE_TEST_RUN: z.preprocess(
    emptyToUndefined,
    z.literal("local-e2e").optional(),
  ),
  SITE_ENVIRONMENT: z.enum(["development", "staging", "production"]).optional(),
});

const parsedEnvironment = databaseEnvironmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid database environment configuration: ${z.prettifyError(parsedEnvironment.error)}`,
  );
}

const environment = parsedEnvironment.data;
const siteEnvironment =
  environment.SITE_ENVIRONMENT ??
  (process.env.NODE_ENV === "development" ? "development" : "staging");

const isDevelopmentDatabase =
  siteEnvironment === "development" &&
  (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development");
const isLocalEndToEndTest =
  environment.DATABASE_TEST_RUN === "local-e2e" && !process.env.RENDER;

if (
  environment.DATABASE_TEST_MODE === "pg-mem" &&
  !isDevelopmentDatabase &&
  !isLocalEndToEndTest
) {
  throw new Error(
    "DATABASE_TEST_MODE=pg-mem is permitted only for local development, database unit tests, or an explicit local end-to-end test run.",
  );
}

if (environment.DATABASE_TEST_MODE && environment.DATABASE_URL) {
  throw new Error(
    "DATABASE_TEST_MODE and DATABASE_URL cannot be configured together.",
  );
}

export const databaseEnvironment = {
  connectionTimeoutMillis: environment.DATABASE_CONNECTION_TIMEOUT_MS,
  connectionUrl: environment.DATABASE_URL,
  idleTimeoutMillis: environment.DATABASE_IDLE_TIMEOUT_MS,
  poolMax: environment.DATABASE_POOL_MAX,
  siteEnvironment,
  testRun: environment.DATABASE_TEST_RUN ?? null,
  testMode: environment.DATABASE_TEST_MODE ?? null,
} as const;

export function assertDatabaseConfigured() {
  if (!databaseEnvironment.connectionUrl && !databaseEnvironment.testMode) {
    throw new Error(
      "DATABASE_URL is required before database-backed features can be used.",
    );
  }
}
