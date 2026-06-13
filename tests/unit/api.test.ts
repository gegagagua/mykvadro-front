import { describe, it, expect } from "vitest";
import { paginator } from "@/lib/api";

const items = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i + 1 }));

describe("paginator", () => {
  it("handles an empty result set", () => {
    const p = paginator([], 1, 12, 0);
    expect(p.last_page).toBe(1);
    expect(p.total).toBe(0);
    expect(p.from).toBeNull();
    expect(p.to).toBeNull();
    expect(p.data).toEqual([]);
  });

  it("computes page bounds for a partial last page", () => {
    const p = paginator(items(10), 2, 12, 22);
    expect(p.current_page).toBe(2);
    expect(p.last_page).toBe(2);
    expect(p.from).toBe(13);
    expect(p.to).toBe(22);
  });
});
