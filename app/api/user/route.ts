import { queryOne, execute } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { getAuthUser, DbUser, toPublicUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return fail("Unauthenticated", 401);
  return ok({ user });
}

export async function PUT(req: Request) {
  const auth = await getAuthUser(req);
  if (!auth) return fail("Unauthenticated", 401);

  let body: { name?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request body", 422);
  }

  const sets: string[] = [];
  const params: unknown[] = [];
  if (typeof body.name === "string" && body.name.trim()) {
    sets.push("name = ?");
    params.push(body.name.trim());
  }
  if (typeof body.phone === "string") {
    sets.push("phone = ?");
    params.push(body.phone || null);
  }
  if (sets.length) {
    sets.push("updated_at = ?");
    params.push(new Date().toISOString().slice(0, 19).replace("T", " "));
    params.push(auth.id);
    await execute(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, params);
  }

  const user = await queryOne<DbUser>(
    "SELECT id, name, email, phone, user_type FROM users WHERE id = ? LIMIT 1",
    [auth.id]
  );
  return ok({ user: user ? toPublicUser(user) : null });
}
