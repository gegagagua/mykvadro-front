import { queryOne, execute } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { createToken, hashPassword, toPublicUser, DbUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; password?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request body", 422);
  }
  const { name, email, password, phone } = body;
  if (!name || !email || !password) {
    return fail("სახელი, ელ-ფოსტა და პაროლი სავალდებულოა", 422);
  }
  if (password.length < 6) return fail("პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო", 422);

  const existing = await queryOne("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing) return fail("ეს ელ-ფოსტა უკვე რეგისტრირებულია", 422, { email: ["taken"] });

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const { insertId } = await execute(
    `INSERT INTO users (name, email, phone, user_type, password, created_at, updated_at)
     VALUES (?, ?, ?, 'user', ?, ?, ?)`,
    [name, email, phone || null, hashPassword(password), now, now]
  );
  const user = await queryOne<DbUser>(
    "SELECT id, name, email, phone, user_type FROM users WHERE id = ? LIMIT 1",
    [insertId]
  );
  const token = createToken(insertId);
  return ok({ user: user ? toPublicUser(user) : null, token }, { status: 201 });
}
