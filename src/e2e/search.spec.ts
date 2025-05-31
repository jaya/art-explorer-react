import { expect, test } from '@playwright/test'

test.describe('Search page', () => {
  test('has title and search form', async ({ page }) => {
    await page.goto('/search')

    await expect(page).toHaveTitle('Search | Art Explorer')
    await expect(page.getByRole('heading', { name: 'Search', exact: true })).toBeVisible()
    await expect(page.getByText('Search the collection')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible()
  })

  test('has no results when query is empty', async ({ page }) => {
    await page.goto('/search')

    const searchList = page.getByTestId('search-list')
    await expect(searchList).not.toBeVisible()
  })

  test('has search results by query', async ({ page }) => {
    await page.goto('/search')

    const searchInput = page.getByRole('textbox', { name: 'Search' })
    await expect(searchInput).toBeVisible()

    await searchInput.fill('paintings')

    const searchButton = page.getByRole('button', { name: 'Search' })
    await expect(searchButton).toBeVisible()
    await searchButton.click()

    const searchList = page.getByTestId('search-list')
    await expect(searchList).toBeVisible()

    const artworks = searchList.getByRole('article')
    await expect(artworks).toHaveCount(15)
  })

  test('has search results by query with params', async ({ page }) => {
    await page.goto('/search?query=paintings')

    await expect(page).toHaveTitle('Search: paintings | Art Explorer')

    const searchInput = page.getByRole('textbox', { name: 'Search' })
    await expect(searchInput).toBeVisible()

    const searchButton = page.getByRole('button', { name: 'Search' })
    await expect(searchButton).toBeVisible()
    await searchButton.click()

    const searchList = page.getByTestId('search-list')
    await expect(searchList).toBeVisible()

    const artworks = searchList.getByRole('article')
    await expect(artworks).toHaveCount(15)
  })

  test('has search results by artist', async ({ page }) => {
    await page.goto('/search')

    const searchTypeButton = page.getByTestId('search-type-trigger')
    await expect(searchTypeButton).toBeVisible()
    await searchTypeButton.click()

    const searchTypeOption = page.getByRole('option', { name: 'Artist/Culture' })
    await expect(searchTypeOption).toBeVisible()
    await searchTypeOption.click()

    const searchInput = page.getByRole('textbox', { name: 'Search' })
    await expect(searchInput).toBeVisible()
    await searchInput.fill('Van Gogh')

    const searchButton = page.getByRole('button', { name: 'Search' })
    await expect(searchButton).toBeVisible()

    await searchButton.click()

    const searchList = page.getByTestId('search-list')
    await expect(searchList).toBeVisible()

    const artworks = searchList.getByRole('article')
    await expect(artworks).toHaveCount(15)
  })

  test('has search results by department', async ({ page }) => {
    await page.goto('/search')

    const searchTypeButton = page.getByTestId('search-type-trigger')
    await expect(searchTypeButton).toBeVisible()
    await searchTypeButton.click()

    const searchTypeOption = page.getByRole('option', { name: 'Department' })
    await expect(searchTypeOption).toBeVisible()
    await searchTypeOption.click()

    const departmentsTrigger = page.getByTestId('departments-trigger')
    await expect(departmentsTrigger).toBeVisible()
    await departmentsTrigger.click()

    const departmentOption = page.getByRole('option', { name: 'Medieval Art' })
    await expect(departmentOption).toBeVisible()
    await departmentOption.click()

    const searchInput = page.getByRole('textbox', { name: 'Search' })
    await expect(searchInput).toBeVisible()
    await searchInput.fill('paintings')

    const searchButton = page.getByRole('button', { name: 'Search' })
    await expect(searchButton).toBeVisible()

    await searchButton.click()

    const searchList = page.getByTestId('search-list')
    await expect(searchList).toBeVisible()

    const artworks = searchList.getByRole('article')
    await expect(artworks).toHaveCount(15)
  })
})
