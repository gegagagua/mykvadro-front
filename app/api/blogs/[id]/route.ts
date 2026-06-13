import { getBlogById } from "@/lib/blogs";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlogById(Number(id));
  if (!blog) return fail("Not found", 404);
  return ok(blog);
}
