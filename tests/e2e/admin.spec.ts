import { test, expect } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("admin@mykvadro.ge");
  await page.locator('input[type="password"]').fill("password");
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin$/, { timeout: 15000 });
}

test("admin can log in and see the dashboard", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({ timeout: 10000 });
});

test("dashboard stat cards render non-zero numbers", async ({ page }) => {
  await login(page);

  for (const title of ["კატეგორიები", "ბრენდები", "პროდუქტები"]) {
    // The stat-card titles render as CardTitle headings (h3); the same words
    // also appear as sidebar nav links, so scope to the heading role.
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible({ timeout: 10000 });
  }

  // The three big stat numbers should be present and at least one non-zero.
  const numbers = page.locator("div.text-3xl.font-bold");
  await expect(numbers.first()).toBeVisible({ timeout: 10000 });
  const values = await numbers.allInnerTexts();
  expect(values.some((v) => Number(v.replace(/\D/g, "")) > 0)).toBe(true);
});

test("admin products table renders rows with prices", async ({ page }) => {
  await login(page);
  await page.goto("/admin/products");

  // Wait for the table to finish loading.
  await expect(page.getByRole("heading", { name: "პროდუქტები" })).toBeVisible({ timeout: 10000 });
  await expect(page.locator("table tbody tr").first()).toBeVisible({ timeout: 15000 });

  const rows = page.locator("table tbody tr");
  expect(await rows.count()).toBeGreaterThanOrEqual(1);
  await expect(page.locator("table tbody").getByText(/₾/).first()).toBeVisible({ timeout: 10000 });
});
