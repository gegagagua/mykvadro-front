import { query, queryOne } from "./db";

export type BlogRow = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  is_active: number;
  created_at: string | null;
  updated_at: string | null;
};

/** Server-side: fetch a single active news post, or null. */
export async function getBlogById(id: number): Promise<BlogRow | null> {
  return queryOne<BlogRow>(
    "SELECT id, title, description, image, is_active, created_at, updated_at FROM blogs WHERE id = ? AND is_active = 1",
    [id]
  );
}

/** Server-side: a few other recent news posts (excluding the current one). */
export async function getRelatedBlogs(id: number, limit = 3): Promise<BlogRow[]> {
  return query<BlogRow>(
    `SELECT id, title, description, image, is_active, created_at, updated_at
     FROM blogs WHERE is_active = 1 AND id <> ? ORDER BY created_at DESC, id DESC LIMIT ${Number(limit)}`,
    [id]
  );
}

/** Server-side: all active news post ids (for sitemap). */
export async function getAllBlogIds(): Promise<number[]> {
  const rows = await query<{ id: number }>("SELECT id FROM blogs WHERE is_active = 1 ORDER BY id");
  return rows.map((r) => Number(r.id));
}
