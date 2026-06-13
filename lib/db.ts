import mysql from "mysql2/promise";

/**
 * Single shared MySQL pool for the whole app. Reuses the connection across
 * hot-reloads in dev (Next.js re-evaluates modules) by stashing it on globalThis.
 */
const globalForDb = globalThis as unknown as { _mysqlPool?: mysql.Pool };

export const pool: mysql.Pool =
  globalForDb._mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "atv",
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    dateStrings: true,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") globalForDb._mysqlPool = pool;

/** Run a query and return typed rows. */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: Record<string, unknown> | unknown[] = []
): Promise<T[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await pool.query(sql, params as any);
  return rows as T[];
}

/** Run a query and return the first row (or null). */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: Record<string, unknown> | unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/** Execute an INSERT/UPDATE/DELETE, returning { insertId, affectedRows }. */
export async function execute(
  sql: string,
  params: Record<string, unknown> | unknown[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result] = await pool.execute(sql, params as any);
  const r = result as mysql.ResultSetHeader;
  return { insertId: r.insertId, affectedRows: r.affectedRows };
}
