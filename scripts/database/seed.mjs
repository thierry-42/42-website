import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { createConfiguredMigrationPool } from "./migrate.mjs";

const seedLockKey = 42_000_043;
const seedFilenamePattern = /^(\d{3,})_([a-z0-9_]+)\.sql$/u;
const defaultSeedDirectory = path.resolve(process.cwd(), "database", "seeds");

function normaliseSqlForTestDatabase(sql) {
  return sql.replace(
    /\$([a-z_][a-z0-9_]*)\$([\s\S]*?)\$\1\$/giu,
    (_match, _tag, value) => `'${value.replaceAll("'", "''")}'`,
  );
}

async function assertSchemaReady(client) {
  const ledger = await client.query(`
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_schema_migrations'
  `);

  if (ledger.rowCount === 0) {
    throw new Error("Database migrations must run before content seeds.");
  }

  const schemaVersions = await client.query(
    "SELECT version FROM _schema_migrations WHERE version IN ('0001', '0002')",
  );
  if (schemaVersions.rowCount !== 2) {
    throw new Error(
      "Migrations 0001 and 0002 must be applied before content seeds.",
    );
  }
}

async function readSeed(seedPath) {
  const filename = path.basename(seedPath);
  const match = seedFilenamePattern.exec(filename);

  if (!match) {
    throw new Error(
      `Content seed ${filename} must use the format 001_descriptive_name.sql.`,
    );
  }

  const sql = await readFile(seedPath, "utf8");
  if (sql.trim().length === 0) {
    throw new Error(`Content seed ${filename} is empty.`);
  }

  return {
    checksum: createHash("sha256").update(sql).digest("hex"),
    filename,
    name: match[2],
    sql,
    version: match[1],
  };
}

async function listContentSeeds(seedDirectory) {
  const entries = await readdir(seedDirectory, { withFileTypes: true });
  const seedPaths = entries
    .filter((entry) => entry.isFile() && seedFilenamePattern.test(entry.name))
    .map((entry) => path.join(seedDirectory, entry.name))
    .sort((left, right) => left.localeCompare(right, "en"));

  if (seedPaths.length === 0) {
    throw new Error("No numbered content seeds were found.");
  }

  const seeds = await Promise.all(
    seedPaths.map((seedPath) => readSeed(seedPath)),
  );
  const versions = new Set();

  for (const seed of seeds) {
    if (versions.has(seed.version)) {
      throw new Error(`Duplicate content seed version ${seed.version}.`);
    }
    versions.add(seed.version);
  }

  return seeds;
}

async function applyContentSeeds({
  isTestDatabase,
  logger,
  pool,
  seeds,
  verifyCompleteLedger,
}) {
  if (!pool) throw new Error("A PostgreSQL pool is required.");

  const client = await pool.connect();
  let lockAcquired = false;

  try {
    if (!isTestDatabase) {
      await client.query("SELECT pg_advisory_lock($1)", [seedLockKey]);
      lockAcquired = true;
    }

    await assertSchemaReady(client);
    const appliedSeedResult = await client.query(
      "SELECT version, name, checksum FROM _content_seeds ORDER BY version",
    );
    const appliedSeeds = new Map(
      appliedSeedResult.rows.map((seed) => [seed.version, seed]),
    );
    const availableVersions = new Set(seeds.map((seed) => seed.version));

    if (verifyCompleteLedger) {
      const missingAppliedSeed = appliedSeedResult.rows.find(
        (seed) => !availableVersions.has(seed.version),
      );
      if (missingAppliedSeed) {
        throw new Error(
          `Applied content seed ${missingAppliedSeed.version}_${missingAppliedSeed.name}.sql is missing from the repository.`,
        );
      }
    }

    const appliedVersions = [];

    for (const seed of seeds) {
      const applied = appliedSeeds.get(seed.version);

      if (applied) {
        if (applied.name !== seed.name || applied.checksum !== seed.checksum) {
          throw new Error(
            `Content seed ${seed.filename} differs from the applied content seed ledger.`,
          );
        }

        logger.info(`${seed.filename} is current.`);
        continue;
      }

      try {
        await client.query(
          isTestDatabase ? normaliseSqlForTestDatabase(seed.sql) : seed.sql,
        );
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      }

      await client.query(
        `INSERT INTO _content_seeds (version, name, checksum)
         VALUES ($1, $2, $3)`,
        [seed.version, seed.name, seed.checksum],
      );

      appliedVersions.push(seed.version);
      logger.info(`Applied ${seed.filename}.`);
    }

    return { appliedVersions };
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

export async function runContentSeeds({
  isTestDatabase = false,
  logger = console,
  pool,
  seedDirectory = defaultSeedDirectory,
} = {}) {
  const seeds = await listContentSeeds(seedDirectory);

  return applyContentSeeds({
    isTestDatabase,
    logger,
    pool,
    seeds,
    verifyCompleteLedger: true,
  });
}

export async function runInitialInsightsSeed({
  isTestDatabase = false,
  logger = console,
  pool,
  seedPath = path.join(defaultSeedDirectory, "001_initial_insights.sql"),
} = {}) {
  const result = await applyContentSeeds({
    isTestDatabase,
    logger,
    pool,
    seeds: [await readSeed(seedPath)],
    verifyCompleteLedger: false,
  });

  return { applied: result.appliedVersions.includes("001") };
}

async function runCommand() {
  const { isTestDatabase, pool } = await createConfiguredMigrationPool();
  try {
    await runContentSeeds({ isTestDatabase, pool });
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
