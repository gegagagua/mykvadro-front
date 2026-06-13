import { test, expect } from "@playwright/test";

test("home page loads with MyKvadro header and renders cards", async ({ page }) => {
  await page.goto("/");

  // The site title is "MyKvadro …" (from layout metadata).
  await expect(page).toHaveTitle(/MyKvadro/i);

  // The header shows the ATV/Trader brand mark and nav links.
  await expect(page.getByRole("link", { name: /find|კვადრო|atv/i }).first()).toBeVisible();

  // Featured/recommended listings render as /atvs/{id} cards with a ₾ price.
  const cards = page.locator('a[href^="/atvs/"]');
  await expect(cards.first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/₾/).first()).toBeVisible({ timeout: 15000 });
});

test("/find-atvs shows multiple listing cards", async ({ page }) => {
  await page.goto("/find-atvs");

  const cards = page.locator('a[href^="/atvs/"]');
  await expect(cards.first()).toBeVisible({ timeout: 15000 });
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
});

test("clicking a listing opens the detail page with price and share section", async ({ page }) => {
  await page.goto("/find-atvs");

  const firstCard = page.locator('a[href^="/atvs/"]').first();
  await expect(firstCard).toBeVisible({ timeout: 15000 });
  await firstCard.click();

  await expect(page).toHaveURL(/\/atvs\/\d+/, { timeout: 15000 });
  await expect(page.getByText(/₾/).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("გაზიარება")).toBeVisible({ timeout: 10000 });
});

test("/blog loads and shows the page heading", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });
});

test("/atvs/5 shows specs and share buttons", async ({ page }) => {
  await page.goto("/atvs/5");

  await expect(page.getByText("გარბენი")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("წელი")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("გაზიარება")).toBeVisible({ timeout: 10000 });
});
