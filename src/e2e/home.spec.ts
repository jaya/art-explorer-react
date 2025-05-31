import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test('has title and links', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('Art Explorer')
    await expect(page.getByRole('heading', { name: 'Art Explorer' })).toBeVisible()

    await expect(page.getByRole('link', { name: 'Favorites' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Search' })).toBeVisible()
  })

  test('changes theme when theme toggle is clicked', async ({ page }) => {
    await page.goto('/')

    const themeButton = page.getByTestId('theme-button')
    await expect(themeButton).toBeVisible()

    await themeButton.click()
    await expect(themeButton).toHaveAttribute('data-theme', 'light')

    await themeButton.click()
    await expect(themeButton).toHaveAttribute('data-theme', 'dark')
  })

  test('has artworks list with 15 items', async ({ page }) => {
    await page.goto('/')

    const artworksList = page.getByTestId('artworks-list')
    await expect(artworksList).toBeVisible()

    const artworks = artworksList.getByRole('article')
    await expect(artworks).toHaveCount(15)
  })

  test('has artworks list with 15 items when load more button is clicked', async ({ page }) => {
    await page.goto('/')

    const artworksList = page.getByTestId('artworks-list')
    await expect(artworksList).toBeVisible()

    const loadMoreButton = page.getByRole('button', { name: 'Load more artworks' })
    await expect(loadMoreButton).toBeVisible()
    await loadMoreButton.click()

    const artworks = artworksList.getByRole('article')
    await expect(artworks).toHaveCount(30)
  })
})
