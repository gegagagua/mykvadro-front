import crypto from "crypto";
import bcrypt from "bcryptjs";
import { queryOne } from "./db";

const SECRET = process.env.AUTH_SECRET || "dev_secret";

export type DbUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  user_type: "admin" | "user";
  password?: string;
};

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  user_type: "admin" | "user";
};

export function toPublicUser(u: DbUser): PublicUser {
  return {
    id: Number(u.id),
    name: u.name,
    email: u.email,
    phone: u.phone,
    user_type: u.user_type,
  };
}

const b64url = (b: Buffer | string) =>
  Buffer.from(b).toString("base64url");

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/** Create a stateless signed token encoding the user id. */
export function createToken(userId: number): string {
  const payload = b64url(JSON.stringify({ uid: userId, iat: Date.now() }));
  return `${payload}.${sign(payload)}`;
}

/** Verify a token's signature and return the user id, or null if invalid. */
export function verifyToken(token: string): number | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  // constant-time compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.uid === "number" ? data.uid : null;
  } catch {
    return null;
  }
}

/** Hash a plaintext password for storage. */
export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 12);
}

/**
 * Verify a password against a stored hash. Normalizes PHP/Laravel `$2y$`
 * bcrypt hashes to the `$2b$` prefix that bcryptjs recognizes (the underlying
 * algorithm is identical).
 */
export function verifyPassword(plain: string, hash: string): boolean {
  if (!hash) return false;
  const normalized = hash.startsWith("$2y$") ? "$2b$" + hash.slice(4) : hash;
  try {
    return bcrypt.compareSync(plain, normalized);
  } catch {
    return false;
  }
}

/** Extract the bearer token from a request's Authorization header. */
export function bearerFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

/** Load the authenticated user for a request, or null if unauthenticated. */
export async function getAuthUser(req: Request): Promise<PublicUser | null> {
  const token = bearerFromRequest(req);
  if (!token) return null;
  const uid = verifyToken(token);
  if (!uid) return null;
  const user = await queryOne<DbUser>(
    "SELECT id, name, email, phone, user_type FROM users WHERE id = ? LIMIT 1",
    [uid]
  );
  return user ? toPublicUser(user) : null;
}
