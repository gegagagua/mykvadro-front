import { query, queryOne } from "@/lib/db";
import { ok, paginator } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Location = {
  id: number;
  name: string;
  country: string;
  region: string | null;
  type: string;
  is_georgian: number;
  is_active: number;
};

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const where: string[] = [];
  const params: unknown[] = [];

  if (p.get("georgian_only") === "true") where.push("is_georgian = 1");
  if (p.get("active_only") === "true") where.push("is_active = 1");
  if (p.get("type")) { where.push("type = ?"); params.push(p.get("type")); }
  if (p.get("country")) { where.push("country = ?"); params.push(p.get("country")); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const page = Math.max(1, Number(p.get("page") || 1));
  const perPage = Math.min(200, Math.max(1, Number(p.get("per_page") || 45)));

  const countRow = await queryOne<{ c: number }>(`SELECT COUNT(*) c FROM locations ${whereSql}`, params);
  const total = Number(countRow?.c ?? 0);

  const rows = await query<Location>(
    `SELECT id, name, country, region, type, is_georgian, is_active
     FROM locations ${whereSql}
     ORDER BY name ASC LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`,
    params
  );
  const items = rows.map((r) => ({
    id: Number(r.id),
    name: r.name,
    country: r.country,
    region: r.region,
    type: r.type,
    is_georgian: !!r.is_georgian,
    is_active: !!r.is_active,
  }));
  return ok(paginator(items, page, perPage, total));
}
