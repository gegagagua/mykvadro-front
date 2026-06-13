import { query, queryOne } from "./db";
import { attachImages, AtvRow, ATV_SELECT } from "./api";

export type ShapedAtv = Awaited<ReturnType<typeof attachImages>>[number];

/** Server-side: fetch a single fully-shaped ATV (with images), or null. */
export async function getAtvById(id: number): Promise<ShapedAtv | null> {
  const row = await queryOne<AtvRow>(`${ATV_SELECT} WHERE a.id = ?`, [id]);
  if (!row) return null;
  const [shaped] = await attachImages([row]);
  return shaped ?? null;
}

/** Server-side: a handful of related ATVs (same brand, else newest). */
export async function getRelatedAtvs(atv: ShapedAtv, limit = 4): Promise<ShapedAtv[]> {
  let rows = await query<AtvRow>(
    `${ATV_SELECT} WHERE a.isActive = 1 AND a.id <> ? AND a.brand_id = ? ORDER BY a.created_at DESC LIMIT ${limit}`,
    [atv.id, atv.brand_id]
  );
  if (rows.length < limit) {
    const more = await query<AtvRow>(
      `${ATV_SELECT} WHERE a.isActive = 1 AND a.id <> ? ORDER BY a.created_at DESC LIMIT ${limit}`,
      [atv.id]
    );
    const seen = new Set(rows.map((r) => r.id));
    for (const m of more) if (!seen.has(m.id) && rows.length < limit) { rows.push(m); seen.add(m.id); }
  }
  return attachImages(rows);
}

/** Server-side: all active ATV ids (for sitemap). */
export async function getAllAtvIds(): Promise<number[]> {
  const rows = await query<{ id: number }>("SELECT id FROM atvs WHERE isActive = 1 ORDER BY id");
  return rows.map((r) => Number(r.id));
}
