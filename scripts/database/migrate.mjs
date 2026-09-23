import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const migrationFilePattern = /^(\d{4,})_([a-z0-9_]+)\.sql$/;
const migrationLockKey = 42_000_042;

function resolveSiteEnvironment() {
  return (
    process.env.SITE_ENVIRONMENT ??
    (process.env.NODE_ENV === "development" ? "development" : "staging")
  );
}

function validatePostgresUrl(value, label) {
  if (!value) return undefined;

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid PostgreSQL connection URL.`);
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error(`${label} must use the postgres or postgresql protocol.`);
  }

  return value;
}

export async function createConfiguredMigrationPool() {
  const testMode = process.env.DATABASE_TEST_MODE?.trim();
  const siteEnvironment = resolveSiteEnvironment();
  const applicationUrl = validatePostgresUrl(
    process.env.DATABASE_URL?.trim(),
    "DATABASE_URL",
  );
  const migrationUrl = validatePostgresUrl(
    process.env.DATABASE_MIGRATION_URL?.trim(),
    "DATABASE_MIGRATION_URL",
  );

  if (testMode) {
    if (testMode !== "pg-mem") {
      throw new Error("DATABASE_TEST_MODE accepts only pg-mem.");
    }
    if (process.env.NODE_ENV !== "test" || siteEnvironment !== "development") {
      throw new Error(
        "DATABASE_TEST_MODE=pg-mem is permitted only when NODE_ENV=test and SITE_ENVIRONMENT=development.",
      );
    }
    if (applicationUrl || migrationUrl) {
      throw new Error(
        "Database connection URLs cannot be configured with DATABASE_TEST_MODE.",
      );
    }

    const { newDb } = await import("pg-mem");
    const memoryDatabase = newDb({ autoCreateForeignKeyIndices: true });
    const adapter = memoryDatabase.adapters.createPg();

    return {
      isTestDatabase: true,
      pool: new adapter.Pool(),
    };
  }

  const connectionString = migrationUrl ?? applicationUrl;
  if (!connectionString) {
    throw new Error(
      "DATABASE_MIGRATION_URL or DATABASE_URL is required to run migrations.",
    );
  }

  const { Pool } = await import("pg");
  return {
    isTestDatabase: false,
    pool: new Pool({
      allowExitOnIdle: true,
      application_name: `company42-migrations-${siteEnvironment}`,
      connectionString,
      connectionTimeoutMillis: 10_000,
      max: 1,
    }),
  };
}

export async function loadMigrations(
  migrationDirectory = path.resolve(process.cwd(), "database", "migrations"),
) {
  const fileNames = (await readdir(migrationDirectory))
    .filter((fileName) => migrationFilePattern.test(fileName))
    .sort((left, right) => left.localeCompare(right));

  if (fileNames.length === 0) {
    throw new Error(`No SQL migrations found in ${migrationDirectory}.`);
  }

  const migrations = await Promise.all(
    fileNames.map(async (fileName) => {
      const match = migrationFilePattern.exec(fileName);
      if (!match) throw new Error(`Invalid migration file name: ${fileName}`);

      const sql = await readFile(
        path.join(migrationDirectory, fileName),
        "utf8",
      );
      return {
        checksum: createHash("sha256").update(sql).digest("hex"),
        fileName,
        name: match[2],
        sql,
        version: match[1],
      };
    }),
  );

  const versions = new Set();
  for (const migration of migrations) {
    if (versions.has(migration.version)) {
      throw new Error(`Duplicate migration version: ${migration.version}`);
    }
    versions.add(migration.version);
  }

  return migrations;
}

async function ensureMigrationLedger(client) {
  const existingLedger = await client.query(`
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_schema_migrations'
  `);

  if (existingLedger.rowCount === 0) {
    await client.query(`
    CREATE TABLE _schema_migrations (
      version TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  }
}

export async function runMigrations({
  isTestDatabase = false,
  logger = console,
  migrationDirectory,
  pool,
} = {}) {
  if (!pool) throw new Error("A PostgreSQL pool is required.");

  const migrations = await loadMigrations(migrationDirectory);
  const client = await pool.connect();
  let lockAcquired = false;

  try {
    if (!isTestDatabase) {
      await client.query("SELECT pg_advisory_lock($1)", [migrationLockKey]);
      lockAcquired = true;
    }

    await ensureMigrationLedger(client);
    const appliedResult = await client.query(
      "SELECT version, name, checksum FROM _schema_migrations ORDER BY version",
    );
    const appliedByVersion = new Map(
      appliedResult.rows.map((migration) => [migration.version, migration]),
    );
    const localVersions = new Set(
      migrations.map((migration) => migration.version),
    );

    for (const applied of appliedResult.rows) {
      if (!localVersions.has(applied.version)) {
        throw new Error(
          `Applied migration ${applied.version}_${applied.name} is missing locally.`,
        );
      }
    }

    const appliedNow = [];
    for (const migration of migrations) {
      const applied = appliedByVersion.get(migration.version);
      if (applied) {
        if (
          applied.name !== migration.name ||
          applied.checksum !== migration.checksum
        ) {
          throw new Error(
            `Migration ${migration.fileName} differs from the applied migration ledger.`,
          );
        }
        continue;
      }

      await client.query("BEGIN");
      try {
        await client.query(migration.sql);
        await client.query(
          `INSERT INTO _schema_migrations (version, name, checksum)
           VALUES ($1, $2, $3)`,
          [migration.version, migration.name, migration.checksum],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }

      appliedNow.push(migration.version);
      logger.info(`Applied ${migration.fileName}.`);
    }

    if (appliedNow.length === 0) logger.info("Database schema is current.");
    return { appliedVersions: appliedNow };
  } finally {
    try {
      if (lockAcquired) {
        await client.query("SELECT pg_advisory_unlock($1)", [migrationLockKey]);
      }
    } finally {
      client.release();
    }
  }
}

async function runCommand() {
  const { isTestDatabase, pool } = await createConfiguredMigrationPool();
  try {
    await runMigrations({ isTestDatabase, pool });
  } finally {
    await pool.end();
  }
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;

if (invokedPath === import.meta.url) {
  runCommand().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
