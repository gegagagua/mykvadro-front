import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Blog = { id: number; title: string; description: string; image: string | null; created_at: string | null };

export async function GET() {
  const blogs = await query<Blog>(
    "SELECT id, title, description, image, created_at FROM blogs WHERE is_active = 1 ORDER BY id DESC"
  );
  return ok(blogs);
}
