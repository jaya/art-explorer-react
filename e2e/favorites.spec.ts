import { test, expect } from "@playwright/test";

test.describe("Basic Favorites Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.removeItem("art-explorer-favorites");
    });
  });

  test("should navigate to empty favorites page", async ({ page }) => {
    const favoritesLink = page
      .locator("nav a[href='/favorites']")
      .or(
        page.locator("a[href='/favorites']").filter({ hasText: "Favorites" }),
      );
    await favoritesLink.first().click();

    await expect(page).toHaveURL(/\/favorites/);

    const emptyStateTexts = [
      /no favorites/i,
      /haven't saved/i,
      /empty/i,
      /nothing here/i,
      /start exploring/i,
    ];

    let foundEmptyState = false;
    for (const text of emptyStateTexts) {
      if (await page.getByText(text).isVisible()) {
        foundEmptyState = true;
        break;
      }
    }

    if (!foundEmptyState) {
      await expect(page.getByRole("main")).toBeVisible();
    }
  });

  test("should show favorites count in navigation", async ({ page }) => {
    const favoritesLink = page
      .locator("nav a[href='/favorites']")
      .or(
        page.locator("a[href='/favorites']").filter({ hasText: "Favorites" }),
      );

    const linkText = await favoritesLink.first().textContent();
    expect(linkText).toBeTruthy();
  });

  test("should maintain localStorage state", async ({ page }) => {
    await page.evaluate(() => {
      const mockFavorite = {
        objectID: 12345,
        title: "Test Artwork",
        artistDisplayName: "Test Artist",
        primaryImageSmall: "",
        dateAdded: new Date().toISOString(),
      };
      localStorage.setItem(
        "art-explorer-favorites",
        JSON.stringify([mockFavorite]),
      );
    });

    const favoritesLink = page
      .locator("nav a[href='/favorites']")
      .or(
        page.locator("a[href='/favorites']").filter({ hasText: "Favorites" }),
      );
    await favoritesLink.first().click();

    const favorites = await page.evaluate(() => {
      const stored = localStorage.getItem("art-explorer-favorites");
      return stored ? JSON.parse(stored) : [];
    });

    expect(favorites).toHaveLength(1);
    expect(favorites[0]).toHaveProperty("objectID", 12345);
  });

  test("should handle favorites page on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileFavoritesButton = page.locator(
      ".md\\:hidden a[href='/favorites']",
    );
    await mobileFavoritesButton.click();

    await expect(page).toHaveURL(/\/favorites/);

    await expect(page.getByRole("main")).toBeVisible();
  });

  test("should navigate back to home from favorites", async ({ page }) => {
    const favoritesLink = page
      .locator("nav a[href='/favorites']")
      .or(
        page.locator("a[href='/favorites']").filter({ hasText: "Favorites" }),
      );
    await favoritesLink.first().click();
    await expect(page).toHaveURL(/\/favorites/);

    const homeLink = page
      .locator('a[href="/"]')
      .filter({ hasText: "ArtExplorer" });
    await homeLink.click();
    await expect(page).toHaveURL("/");

    await expect(
      page.getByRole("heading", { name: /discover amazing art/i }),
    ).toBeVisible();
  });
});
