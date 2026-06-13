import { queryOne } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { createToken, verifyPassword, toPublicUser, DbUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request body", 422);
  }
  const { email, password } = body;
  if (!email || !password) return fail("ელ-ფოსტა და პაროლი სავალდებულოა", 422);

  const user = await queryOne<DbUser>(
    "SELECT id, name, email, phone, user_type, password FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  if (!user || !verifyPassword(password, user.password || "")) {
    return fail("ელ-ფოსტა ან პაროლი არასწორია", 401);
  }
  const token = createToken(Number(user.id));
  return ok({ user: toPublicUser(user), token });
}
