import { query, queryOne, execute } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Brand = { id: number; title: string; image: string | null };

export async function GET() {
  const brands = await query<Brand>(
    "SELECT id, title, image FROM brands ORDER BY title ASC"
  );
  return ok(brands);
}

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user || user.user_type !== "admin") return fail("Forbidden", 403);

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  if (!title) return fail("სათაური სავალდებულოა", 422);

  const image = await saveUpload(form.get("image") as File | null, "brands");
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const { insertId } = await execute(
    "INSERT INTO brands (title, image, created_at, updated_at) VALUES (?, ?, ?, ?)",
    [title, image, now, now]
  );
  const brand = await queryOne<Brand>("SELECT id, title, image FROM brands WHERE id = ?", [insertId]);
  return ok(brand, { status: 201 });
}
