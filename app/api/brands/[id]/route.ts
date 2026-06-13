import { queryOne, execute } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
type Brand = { id: number; title: string; image: string | null };

// The frontend updates via POST /brands/{id}?_method=PUT with multipart form data.
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user || user.user_type !== "admin") return fail("Forbidden", 403);

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  if (!title) return fail("სათაური სავალდებულოა", 422);

  const image = await saveUpload(form.get("image") as File | null, "brands");
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  if (image) {
    await execute("UPDATE brands SET title = ?, image = ?, updated_at = ? WHERE id = ?", [title, image, now, Number(id)]);
  } else {
    await execute("UPDATE brands SET title = ?, updated_at = ? WHERE id = ?", [title, now, Number(id)]);
  }
  const brand = await queryOne<Brand>("SELECT id, title, image FROM brands WHERE id = ?", [Number(id)]);
  if (!brand) return fail("Not found", 404);
  return ok(brand);
}

export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user || user.user_type !== "admin") return fail("Forbidden", 403);
  await execute("DELETE FROM brands WHERE id = ?", [Number(id)]);
  return ok({ message: "deleted" });
}
