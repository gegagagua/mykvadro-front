import { queryOne, execute } from "@/lib/db";
import { ok, fail, attachImages, AtvRow, ATV_SELECT } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function loadOwner(id: number) {
  return queryOne<{ user_id: number | null }>("SELECT user_id FROM atvs WHERE id = ? LIMIT 1", [id]);
}

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const row = await queryOne<AtvRow>(`${ATV_SELECT} WHERE a.id = ?`, [Number(id)]);
  if (!row) return fail("Not found", 404);
  const [shaped] = await attachImages([row]);
  return ok(shaped);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const atvId = Number(id);
  const user = await getAuthUser(req);
  if (!user) return fail("Unauthenticated", 401);

  const owner = await loadOwner(atvId);
  if (!owner) return fail("Not found", 404);
  if (user.user_type !== "admin" && owner.user_id !== user.id) return fail("Forbidden", 403);

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return fail("Invalid request body", 422);
  }

  const cols: Record<string, unknown> = {
    name: b.name,
    price: b.price !== undefined ? Number(b.price) : undefined,
    year: b.year !== undefined ? Number(b.year) : undefined,
    mileage: b.mileage !== undefined ? Number(b.mileage) : undefined,
    engine: b.engine,
    transmission: b.transmission,
    fuel: b.fuel,
    clearance: b.clearance,
    description: b.description,
    brand_id: b.brand_id ?? null,
    category_id: b.category_id ?? null,
    location_id: b.location_id ?? null,
  };
  if (b.isActive !== undefined) cols.isActive = b.isActive ? 1 : 0;
  if (b.isVip !== undefined) cols.isVip = b.isVip ? 1 : 0;

  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const [k, v] of Object.entries(cols)) {
    if (v !== undefined) {
      sets.push(`${k} = ?`);
      vals.push(v);
    }
  }
  sets.push("updated_at = ?");
  vals.push(new Date().toISOString().slice(0, 19).replace("T", " "));
  vals.push(atvId);
  await execute(`UPDATE atvs SET ${sets.join(", ")} WHERE id = ?`, vals);

  const row = await queryOne<AtvRow>(`${ATV_SELECT} WHERE a.id = ?`, [atvId]);
  const [shaped] = await attachImages(row ? [row] : []);
  return ok(shaped);
}

export async function DELETE(req: Request, { params }: Ctx) {
  const { id } = await params;
  const atvId = Number(id);
  const user = await getAuthUser(req);
  if (!user) return fail("Unauthenticated", 401);

  const owner = await loadOwner(atvId);
  if (!owner) return fail("Not found", 404);
  if (user.user_type !== "admin" && owner.user_id !== user.id) return fail("Forbidden", 403);

  await execute("DELETE FROM atvs WHERE id = ?", [atvId]);
  return ok({ message: "deleted" });
}
