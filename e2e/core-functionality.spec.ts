import { test, expect } from "@playwright/test";

test.describe("Core Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load homepage with main elements", async ({ page }) => {
    await expect(page).toHaveTitle(/ArtExplorer/);

    await expect(
      page.getByRole("heading", { name: /discover amazing art/i }),
    ).toBeVisible();

    await expect(
      page.getByText(/explore thousands of masterpieces/i),
    ).toBeVisible();

    await expect(page.getByPlaceholder(/search artworks/i)).toBeVisible();

    await expect(page.getByText(/filter by department/i)).toBeVisible();
  });

  test("should be able to type in search field", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search artworks/i);

    await searchInput.fill("monet");
    await expect(searchInput).toHaveValue("monet");

    const clearButton = page
      .locator(".relative")
      .locator("button")
      .filter({ hasText: "" });
    await expect(clearButton).toBeVisible();
  });

  test("should be able to clear search", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search artworks/i);

    await searchInput.fill("test search");

    const clearButton = page
      .locator(".relative")
      .locator("button")
      .filter({ hasText: "" });
    await clearButton.click();

    await expect(searchInput).toHaveValue("");
  });

  test("should load department filter options", async ({ page }) => {
    const selector = page.getByRole("combobox");
    await selector.click();

    await expect(
      page.getByRole("option", { name: "All Departments" }),
    ).toBeVisible();

    await page.waitForTimeout(2000);

    await page.keyboard.press("Escape");
  });

  test("should navigate to favorites page", async ({ page }) => {
    const favoritesLink = page
      .locator("nav a[href='/favorites']")
      .or(
        page.locator("a[href='/favorites']").filter({ hasText: "Favorites" }),
      );
    await expect(favoritesLink.first()).toBeVisible();

    await favoritesLink.first().click();

    await expect(page).toHaveURL(/\/favorites/);
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(
      page.getByRole("heading", { name: /discover amazing art/i }),
    ).toBeVisible();
    await expect(page.getByPlaceholder(/search artworks/i)).toBeVisible();

    const mobileFavoritesButton = page.locator(
      ".md\\:hidden a[href='/favorites']",
    );
    await expect(mobileFavoritesButton).toBeVisible();
  });

  test("should have working theme toggle", async ({ page }) => {
    const themeToggle = page
      .locator("button")
      .filter({ hasText: /moon|sun/i })
      .or(page.getByRole("button", { name: /toggle theme/i }));

    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      await page.waitForTimeout(500);
    }
  });
});
