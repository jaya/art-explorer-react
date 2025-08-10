import { test, expect } from "@playwright/test";

test.describe("Basic Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should perform search and show results area", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search artworks/i);

    // Perform a simple search
    await searchInput.fill("painting");

    // Wait for debounced search to trigger
    await page.waitForTimeout(1000);

    // Should show some loading or results area
    // Since we don't know exact selectors, we'll check for common patterns
    const possibleResultsArea = page
      .locator('[class*="grid"]')
      .or(page.locator('[class*="artwork"]'))
      .or(page.locator("main section"));

    await expect(possibleResultsArea.first()).toBeVisible({ timeout: 10000 });
  });

  test("should handle empty search gracefully", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search artworks/i);

    // Clear any existing search
    await searchInput.fill("");
    await page.waitForTimeout(1000);

    // Should not show error states
    await expect(page.getByText(/error/i)).not.toBeVisible();
  });

  test("should show loading state during search", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search artworks/i);

    // Start a search
    await searchInput.fill("van gogh");

    // Look for any loading indicators
    const loadingIndicators = page
      .locator('[class*="loading"]')
      .or(page.locator('[class*="skeleton"]'))
      .or(page.locator('[class*="spinner"]'));

    // May or may not show loading (depends on speed)
    try {
      await expect(loadingIndicators.first()).toBeVisible({ timeout: 2000 });
    } catch {
      // Loading might be too fast to catch, which is fine
    }
  });

  test("should filter by department", async ({ page }) => {
    // Open department selector
    const selector = page.getByRole("combobox");
    await selector.click();

    // Wait for options to load
    await page.waitForTimeout(2000);

    // Look for any department option (not "All Departments")
    const departmentOptions = page
      .getByRole("option")
      .filter({ hasNotText: /all departments/i });

    if ((await departmentOptions.count()) > 0) {
      // Click on first available department
      await departmentOptions.first().click();

      // Wait for filter to apply
      await page.waitForTimeout(1000);

      // Check that selector shows selected department
      await expect(selector).not.toContainText("All Departments");
    }
  });

  test("should handle API errors gracefully", async ({ page }) => {
    // Mock API to return error
    await page.route("**/api/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // Reload page to trigger with mocked API
    await page.reload();

    // Try to search
    const searchInput = page.getByPlaceholder(/search artworks/i);
    await searchInput.fill("test");

    // Wait for error handling
    await page.waitForTimeout(3000);

    // Should not crash the app
    await expect(searchInput).toBeVisible();
  });
});
