import { query, queryOne, execute } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Category = { id: number; title: string; image: string | null; is_active: number };

function shape(c: Category) {
  return { id: Number(c.id), title: c.title, image: c.image, is_active: !!c.is_active };
}

export async function GET(req: Request) {
  const activeOnly = new URL(req.url).searchParams.get("active_only") === "true";
  const rows = await query<Category>(
    `SELECT id, title, image, is_active FROM categories ${activeOnly ? "WHERE is_active = 1" : ""} ORDER BY title ASC`
  );
  return ok(rows.map(shape));
}

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user || user.user_type !== "admin") return fail("Forbidden", 403);

  let b: { title?: string; image?: string };
  try {
    b = await req.json();
  } catch {
    return fail("Invalid request body", 422);
  }
  const title = (b.title || "").trim();
  if (!title) return fail("სათაური სავალდებულოა", 422);

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const { insertId } = await execute(
    "INSERT INTO categories (title, image, is_active, created_at, updated_at) VALUES (?, ?, 1, ?, ?)",
    [title, b.image || null, now, now]
  );
  const cat = await queryOne<Category>("SELECT id, title, image, is_active FROM categories WHERE id = ?", [insertId]);
  return ok(cat ? shape(cat) : null, { status: 201 });
}
