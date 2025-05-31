import { expect, test } from '@playwright/test'

test.describe('Details page', () => {
  test('has image, title, artist name and informations', async ({ page }) => {
    await page.goto('/details/451023')

    await expect(page).toHaveTitle('Details of The Lovers | Art Explorer')

    await expect(page.getByRole('heading', { name: 'The Lovers' })).toBeVisible()

    await expect(page.getByRole('img', { name: 'The Lovers' })).toBeVisible()
    await expect(page.getByText("Riza-yi 'Abbasi")).toBeVisible()
    await expect(page.getByText('Islamic Art')).toBeVisible()
    await expect(page.getByText('Opaque watercolor, ink, and gold on paper')).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'https://www.metmuseum.org/art/collection/search/451023' }),
    ).toBeVisible()
  })
})
