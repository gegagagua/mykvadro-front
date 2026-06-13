import { NextResponse } from "next/server";
import { query } from "./db";

/** Standard success envelope: { data } (+ optional message). */
export function ok(data: unknown, init?: { status?: number; message?: string }) {
  const body: Record<string, unknown> = { data };
  if (init?.message) body.message = init.message;
  return NextResponse.json(body, { status: init?.status ?? 200 });
}

/** Standard error envelope: { message, errors? }. */
export function fail(message: string, status = 400, errors?: unknown) {
  return NextResponse.json({ message, ...(errors ? { errors } : {}) }, { status });
}

/** Build a Laravel-style length-aware paginator object. */
export function paginator<T>(items: T[], page: number, perPage: number, total: number) {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? null : (page - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(page * perPage, total);
  return {
    current_page: page,
    data: items,
    from,
    to,
    per_page: perPage,
    last_page: lastPage,
    total,
  };
}

export type AtvRow = {
  id: number;
  user_id: number | null;
  brand_id: number | null;
  category_id: number | null;
  location_id: number | null;
  name: string;
  price: string;
  year: number;
  clearance: string;
  mileage: number;
  transmission: string;
  fuel: string;
  isActive: number;
  isVip: number;
  engine: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  brand_title: string | null;
  category_title: string | null;
  location_name: string | null;
};

const ATV_SELECT = `
  SELECT a.id, a.user_id, a.brand_id, a.category_id, a.location_id,
         a.name, a.price, a.year, a.clearance, a.mileage, a.transmission,
         a.fuel, a.isActive, a.isVip, a.engine, a.description,
         a.created_at, a.updated_at,
         b.title AS brand_title,
         c.title AS category_title,
         l.name  AS location_name
  FROM atvs a
  LEFT JOIN brands b     ON b.id = a.brand_id
  LEFT JOIN categories c ON c.id = a.category_id
  LEFT JOIN locations l  ON l.id = a.location_id
`;

export type AtvImage = { id: number; url: string; alt_text: string | null; is_primary: number; sort_order: number };
type ImageRow = AtvImage & { atv_id: number };

/** Shape a raw ATV row + its images into the JSON object the frontend expects. */
function shapeAtv(row: AtvRow, images: ImageRow[]) {
  const active = images
    .filter((i) => i.atv_id === row.id)
    .sort((a, b) => b.is_primary - a.is_primary || a.sort_order - b.sort_order);
  return {
    id: Number(row.id),
    user_id: row.user_id ? Number(row.user_id) : null,
    brand_id: row.brand_id ? Number(row.brand_id) : null,
    category_id: row.category_id ? Number(row.category_id) : null,
    location_id: row.location_id ? Number(row.location_id) : null,
    name: row.name,
    price: row.price,
    year: Number(row.year),
    clearance: row.clearance,
    mileage: Number(row.mileage),
    transmission: row.transmission,
    fuel: row.fuel,
    isActive: !!row.isActive,
    isVip: !!row.isVip,
    engine: row.engine,
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
    brand: row.brand_title ? { id: Number(row.brand_id), title: row.brand_title } : null,
    category: row.category_title ? { id: Number(row.category_id), title: row.category_title } : null,
    location: row.location_name ? { id: Number(row.location_id), name: row.location_name } : null,
    active_images: active.map((i) => ({ id: i.id, url: i.url, alt_text: i.alt_text })),
    first_image_url: active[0]?.url ?? null,
  };
}

/** Fetch and attach images for a set of ATV rows. */
export async function attachImages(rows: AtvRow[]) {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => "?").join(",");
  const images = await query<ImageRow>(
    `SELECT id, atv_id, url, alt_text, is_primary, sort_order
     FROM atv_images
     WHERE is_active = 1 AND atv_id IN (${placeholders})`,
    ids
  );
  return rows.map((r) => shapeAtv(r, images));
}

export { ATV_SELECT };
