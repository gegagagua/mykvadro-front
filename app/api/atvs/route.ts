import { query, queryOne, execute } from "@/lib/db";
import { ok, fail, paginator, attachImages, AtvRow, ATV_SELECT } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SORTS: Record<string, string> = {
  newest: "a.created_at DESC, a.id DESC",
  oldest: "a.created_at ASC, a.id ASC",
  "price-low": "a.price ASC",
  "price-high": "a.price DESC",
  "year-new": "a.year DESC",
  "year-old": "a.year ASC",
  "mileage-low": "a.mileage ASC",
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const p = url.searchParams;
  const page = Math.max(1, Number(p.get("page") || 1));
  const perPage = Math.min(60, Math.max(1, Number(p.get("per_page") || 12)));

  const where: string[] = [];
  const params: unknown[] = [];

  if (p.get("user_id")) {
    where.push("a.user_id = ?");
    params.push(Number(p.get("user_id")));
  } else {
    // public listings only show active items
    where.push("a.isActive = 1");
  }
  if (p.get("brand_id")) { where.push("a.brand_id = ?"); params.push(Number(p.get("brand_id"))); }
  if (p.get("category_id")) { where.push("a.category_id = ?"); params.push(Number(p.get("category_id"))); }
  if (p.get("location_id")) { where.push("a.location_id = ?"); params.push(Number(p.get("location_id"))); }
  if (p.get("min_price")) { where.push("a.price >= ?"); params.push(Number(p.get("min_price"))); }
  if (p.get("max_price")) { where.push("a.price <= ?"); params.push(Number(p.get("max_price"))); }
  if (p.get("min_year")) { where.push("a.year >= ?"); params.push(Number(p.get("min_year"))); }
  if (p.get("max_year")) { where.push("a.year <= ?"); params.push(Number(p.get("max_year"))); }
  if (p.get("search")) { where.push("(a.name LIKE ? OR a.description LIKE ?)"); const s = `%${p.get("search")}%`; params.push(s, s); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderBy = SORTS[p.get("sort") || "newest"] || SORTS.newest;

  const countRow = await queryOne<{ c: number }>(
    `SELECT COUNT(*) AS c FROM atvs a ${whereSql}`,
    params
  );
  const total = Number(countRow?.c ?? 0);

  const rows = await query<AtvRow>(
    `${ATV_SELECT} ${whereSql} ORDER BY ${orderBy} LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`,
    params
  );
  const items = await attachImages(rows);
  return ok(paginator(items, page, perPage, total));
}

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return fail("Unauthenticated", 401);

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return fail("Invalid request body", 422);
  }
  if (!b.name || b.price === undefined || b.price === "") {
    return fail("სახელი და ფასი სავალდებულოა", 422);
  }

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const { insertId } = await execute(
    `INSERT INTO atvs
      (user_id, brand_id, category_id, location_id, name, price, year, clearance,
       mileage, transmission, fuel, isActive, isVip, engine, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?, ?, ?)`,
    [
      user.id,
      b.brand_id ?? null,
      b.category_id ?? null,
      b.location_id ?? null,
      b.name,
      Number(b.price) || 0,
      Number(b.year) || new Date().getFullYear(),
      (b.clearance as string) || "",
      Number(b.mileage) || 0,
      (b.transmission as string) || "",
      (b.fuel as string) || "",
      (b.engine as string) || "",
      (b.description as string) || null,
      now,
      now,
    ]
  );

  // Give every new listing a default image so it renders nicely everywhere.
  await execute(
    `INSERT INTO atv_images (atv_id, url, type, alt_text, sort_order, is_primary, is_active, created_at, updated_at)
     VALUES (?, ?, 'image', ?, 1, 1, 1, ?, ?)`,
    [insertId, "/seed/atvs/placeholder.svg", String(b.name), now, now]
  );

  const row = await queryOne<AtvRow>(`${ATV_SELECT} WHERE a.id = ?`, [insertId]);
  const [shaped] = await attachImages(row ? [row] : []);
  return ok(shaped, { status: 201 });
}
