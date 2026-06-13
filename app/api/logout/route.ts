import { ok } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tokens are stateless; logout is a client-side token discard. Acknowledge it.
export async function POST() {
  return ok({ message: "logged out" });
}
