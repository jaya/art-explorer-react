import { expect, test } from '@playwright/test'

test.describe('Favorites page', () => {
  test('has empty list when there are no favorites', async ({ page }) => {
    await page.goto('/favorites')

    await expect(page).toHaveTitle('Favorites | Art Explorer')

    await expect(page.getByRole('heading', { name: 'Favorites' })).toBeVisible()
    await expect(page.getByText('This place is so empty, please add some artworks to your favorites!')).toBeVisible()
  })

  test('adds artwork to favorites', async ({ page }) => {
    await page.goto('/')

    const firstArtwork = page.getByTestId('artworks-list').getByRole('article').first()
    await expect(firstArtwork).toBeVisible()

    const favoriteButton = firstArtwork.getByRole('button', { name: 'Add to favorites' })
    await expect(favoriteButton).toBeVisible()

    await favoriteButton.click()

    await expect(page.getByText('Artwork added to favorites!')).toBeVisible()

    await page.goto('/favorites')

    const favorites = page.getByTestId('favorites-list').getByRole('article')
    await expect(favorites).toHaveCount(1)
  })

  test('removes artwork from favorites', async ({ page }) => {
    await page.goto('/')

    const firstArtwork = page.getByTestId('artworks-list').getByRole('article').first()
    await expect(firstArtwork).toBeVisible()

    const addFavoriteButton = firstArtwork.getByRole('button', { name: 'Add to favorites' })
    await expect(addFavoriteButton).toBeVisible()

    await addFavoriteButton.click()

    await expect(page.getByText('Artwork added to favorites!')).toBeVisible()

    await page.goto('/favorites')

    const firstFavorite = page.getByTestId('favorites-list').getByRole('article').first()
    await expect(firstFavorite).toBeVisible()

    const removeFavoriteButton = firstFavorite.getByRole('button', { name: 'Remove from favorites' })
    await expect(removeFavoriteButton).toBeVisible()

    await removeFavoriteButton.click()

    const favorites = page.getByTestId('favorites-list').getByRole('article')
    await expect(favorites).toHaveCount(0)
  })
})
