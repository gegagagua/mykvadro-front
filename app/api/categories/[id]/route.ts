import { queryOne, execute } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
type Category = { id: number; title: string; image: string | null; is_active: number };

const shape = (c: Category) => ({ id: Number(c.id), title: c.title, image: c.image, is_active: !!c.is_active });

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user || user.user_type !== "admin") return fail("Forbidden", 403);

  let b: { title?: string; image?: string; is_active?: boolean };
  try {
    b = await req.json();
  } catch {
    return fail("Invalid request body", 422);
  }
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (b.title !== undefined) { sets.push("title = ?"); vals.push(b.title.trim()); }
  if (b.image !== undefined) { sets.push("image = ?"); vals.push(b.image || null); }
  if (b.is_active !== undefined) { sets.push("is_active = ?"); vals.push(b.is_active ? 1 : 0); }
  if (sets.length) {
    sets.push("updated_at = ?");
    vals.push(new Date().toISOString().slice(0, 19).replace("T", " "));
    vals.push(Number(id));
    await execute(`UPDATE categories SET ${sets.join(", ")} WHERE id = ?`, vals);
  }
  const cat = await queryOne<Category>("SELECT id, title, image, is_active FROM categories WHERE id = ?", [Number(id)]);
  if (!cat) return fail("Not found", 404);
  return ok(shape(cat));
}

export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user || user.user_type !== "admin") return fail("Forbidden", 403);
  await execute("DELETE FROM categories WHERE id = ?", [Number(id)]);
  return ok({ message: "deleted" });
}
