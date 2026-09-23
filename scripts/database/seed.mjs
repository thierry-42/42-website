import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createConfiguredMigrationPool } from "./migrate.mjs";

const seedLockKey = 42_000_043;
const seedVersion = "001";
const seedName = "initial_insights";

async function assertSchemaReady(client) {
  const ledger = await client.query(`
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_schema_migrations'
  `);

  if (ledger.rowCount === 0) {
    throw new Error("Database migrations must run before the initial seed.");
  }

  const schemaVersions = await client.query(
    "SELECT version FROM _schema_migrations WHERE version IN ('0001', '0002')",
  );
  if (schemaVersions.rowCount !== 2) {
    throw new Error(
      "Migrations 0001 and 0002 must be applied before the initial seed.",
    );
  }
}

export async function runInitialInsightsSeed({
  isTestDatabase = false,
  logger = console,
  pool,
  seedPath = path.resolve(
    process.cwd(),
    "database",
    "seeds",
    "001_initial_insights.sql",
  ),
} = {}) {
  if (!pool) throw new Error("A PostgreSQL pool is required.");

  const sql = await readFile(seedPath, "utf8");
  if (sql.trim().length === 0) throw new Error("The initial seed is empty.");
  const checksum = createHash("sha256").update(sql).digest("hex");

  const client = await pool.connect();
  let lockAcquired = false;

  try {
    if (!isTestDatabase) {
      await client.query("SELECT pg_advisory_lock($1)", [seedLockKey]);
      lockAcquired = true;
    }

    await assertSchemaReady(client);
    const appliedSeed = await client.query(
      "SELECT name, checksum FROM _content_seeds WHERE version = $1",
      [seedVersion],
    );

    if (appliedSeed.rowCount > 0) {
      const applied = appliedSeed.rows[0];
      if (applied.name !== seedName || applied.checksum !== checksum) {
        throw new Error(
          "The initial Insights seed differs from the applied content seed ledger.",
        );
      }

      logger.info("Initial Insights seed is current.");
      return { applied: false };
    }

    try {
      await client.query(sql);
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    }

    await client.query(
      `INSERT INTO _content_seeds (version, name, checksum)
       VALUES ($1, $2, $3)`,
      [seedVersion, seedName, checksum],
    );

    logger.info("Applied 001_initial_insights.sql.");
    return { applied: true };
  } finally {
    try {
      if (lockAcquired) {
        await client.query("SELECT pg_advisory_unlock($1)", [seedLockKey]);
      }
    } finally {
      client.release();
    }
  }
}

async function runCommand() {
  const { isTestDatabase, pool } = await createConfiguredMigrationPool();
  try {
    await runInitialInsightsSeed({ isTestDatabase, pool });
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
