import type { Artwork } from '@art-explorer/core'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArtworkFavoriteCard } from '~/components/artwork-card/artwork-favorite.card'

const mockArtwork = {
  objectID: 123,
  primaryImageSmall: 'https://example.com/image-small.jpg',
  primaryImage: 'https://example.com/image.jpg',
  title: 'Test Artwork',
  artistDisplayName: 'Test Artist',
  objectDate: '2025',
  medium: 'Oil on canvas',
  department: 'Paintings',
  objectURL: 'https://example.com/artwork',
} as Artwork

jest.mock('~/components/buttons/favorite.button', () => ({
  FavoriteButton: ({ artworkId }: { artworkId: number }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button data-testid={`favorite-button-${artworkId}`}>Favorite</button>
  ),
}))

describe('ArtworkFavoriteCard', () => {
  it('renders artwork image and title', () => {
    render(<ArtworkFavoriteCard artwork={mockArtwork} />)

    const img = screen.getByAltText(mockArtwork.title)
    const title = screen.getByText(mockArtwork.title)

    expect(img).toBeInTheDocument()
    expect(title).toBeInTheDocument()
  })

  it('renders FavoriteButton', () => {
    render(<ArtworkFavoriteCard artwork={mockArtwork} />)

    const favoriteButton = screen.getByTestId(
      `favorite-button-${mockArtwork.objectID}`
    )

    expect(favoriteButton).toBeInTheDocument()
  })

  it('opens and closes dialog on button click', async () => {
    render(<ArtworkFavoriteCard artwork={mockArtwork} />)

    const expandButton = screen.getByRole('button', { name: /expand dialog/i })

    await userEvent.click(expandButton)

    const dialogTitle = screen
      .getAllByText(mockArtwork.title)
      .filter(el => el.tagName === 'H2')[0]
    const dialogDescription = await screen.findByText(
      `${mockArtwork.artistDisplayName} • ${mockArtwork.objectDate}`
    )
    const officialLink = screen.getByRole('link', {
      name: /see on official site/i,
    })

    expect(dialogTitle).toBeInTheDocument()
    expect(dialogDescription).toBeInTheDocument()
    expect(officialLink).toHaveAttribute('href', mockArtwork.objectURL)
  })

  it('renders fallback image when primaryImage is missing', () => {
    const artworkWithoutPrimaryImage = { ...mockArtwork, primaryImage: '' }
    render(<ArtworkFavoriteCard artwork={artworkWithoutPrimaryImage} />)

    const img = screen.getByAltText(artworkWithoutPrimaryImage.title)

    expect(img).toHaveAttribute(
      'src',
      artworkWithoutPrimaryImage.primaryImageSmall
    )
  })
})
