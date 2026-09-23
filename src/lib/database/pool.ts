import "server-only";

import type { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

import {
  assertDatabaseConfigured,
  databaseEnvironment,
} from "@/lib/database/config";

declare global {
  var company42DatabasePool: Promise<Pool> | undefined;
}

async function createDatabasePool(): Promise<Pool> {
  assertDatabaseConfigured();

  if (databaseEnvironment.testMode === "pg-mem") {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const { newDb } = await import("pg-mem");
    const memoryDatabase = newDb({ autoCreateForeignKeyIndices: true });
    const adapter = memoryDatabase.adapters.createPg();
    const pool = new adapter.Pool() as unknown as Pool;
    const [migrationSql, seedSql] = await Promise.all([
      readFile(
        path.resolve(
          process.cwd(),
          "database",
          "migrations",
          "0001_create_insights_schema.sql",
        ),
        "utf8",
      ),
      readFile(
        path.resolve(
          process.cwd(),
          "database",
          "seeds",
          "001_initial_insights.sql",
        ),
        "utf8",
      ),
    ]);

    await pool.query(migrationSql);
    await pool.query(seedSql);

    return pool;
  }

  const { Pool: PostgresPool } = await import("pg");
  const pool = new PostgresPool({
    allowExitOnIdle: false,
    application_name: `company42-${databaseEnvironment.siteEnvironment}`,
    connectionString: databaseEnvironment.connectionUrl,
    connectionTimeoutMillis: databaseEnvironment.connectionTimeoutMillis,
    idleTimeoutMillis: databaseEnvironment.idleTimeoutMillis,
    max: databaseEnvironment.poolMax,
  });

  pool.on("error", (error) => {
    console.error("Unexpected idle PostgreSQL client error.", error);
  });

  return pool;
}

export function getDatabasePool(): Promise<Pool> {
  globalThis.company42DatabasePool ??= createDatabasePool().catch((error) => {
    globalThis.company42DatabasePool = undefined;
    throw error;
  });

  return globalThis.company42DatabasePool;
}

export async function queryDatabase<
  Row extends QueryResultRow = QueryResultRow,
>(text: string, values: readonly unknown[] = []): Promise<QueryResult<Row>> {
  const pool = await getDatabasePool();
  return pool.query<Row>(text, [...values]);
}

export async function withDatabaseClient<Result>(
  operation: (client: PoolClient) => Promise<Result>,
): Promise<Result> {
  const pool = await getDatabasePool();
  const client = await pool.connect();

  try {
    return await operation(client);
  } finally {
    client.release();
  }
}

export async function closeDatabasePool(): Promise<void> {
  const poolPromise = globalThis.company42DatabasePool;
  globalThis.company42DatabasePool = undefined;

  if (poolPromise) {
    const pool = await poolPromise;
    await pool.end();
  }
}
